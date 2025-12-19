require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { getMinecraftStatus } = require('./mcStatus');
const { connectRCON, sendMessageToMinecraft, closeRCON } = require('./rcon');
const { initializePlayer, playMusic, stopMusic, pauseResume, getQueue, skipTrack, createControlPanel, createPlayerEmbed } = require('./spotify');

// Validar variables de entorno
const requiredEnvVars = ['DISCORD_TOKEN', 'MC_HOST', 'MC_PORT', 'CHANNEL_ID'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: ${envVar} no está definido en las variables de entorno`);
    process.exit(1);
  }
}

// Configuración
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL) || 60000; // Por defecto 1 minuto
const NOTIFICATION_CHANNEL_ID = process.env.NOTIFICATION_CHANNEL_ID || process.env.CHANNEL_ID; // Canal para notificaciones
const DISCORD_TO_MC_CHANNEL_ID = process.env.DISCORD_TO_MC_CHANNEL_ID; // Canal para enviar mensajes a Minecraft

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Almacenar el tiempo de primera detección online y el ID del mensaje
let firstOnlineTime = null;
let statusMessageId = null;
let lastStatus = null; // Para detectar cambios de estado
const statusHistory = []; // Historial de cambios de estado

/**
 * Formatea el tiempo en formato legible
 */
function formatUptime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const days = Math.floor(hours / 24);
  const hoursMod = hours % 24;
  
  if (days > 0) {
    return `${days}d ${hoursMod}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Formatea la fecha y hora
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Registra un cambio de estado en el historial
 */
function logStatusChange(status) {
  const change = {
    timestamp: Date.now(),
    online: status.online,
    players: status.players?.online || 0,
    version: status.version || 'N/A'
  };
  
  statusHistory.push(change);
  
  // Mantener solo los últimos 50 cambios
  if (statusHistory.length > 50) {
    statusHistory.shift();
  }
}

/**
 * Envía una notificación cuando cambia el estado del servidor
 */
async function sendStatusChangeNotification(oldStatus, newStatus) {
  try {
    // Canal específico para notificaciones de cambio de estado
    const STATUS_CHANGE_CHANNEL_ID = '1245191628973539349';
    const notificationChannel = await client.channels.fetch(STATUS_CHANGE_CHANNEL_ID);
    
    if (!notificationChannel) {
      console.error(`❌ No se pudo encontrar el canal de notificaciones: ${STATUS_CHANGE_CHANNEL_ID}`);
      return;
    }

    let notificationText = '';
    let color = 0x00ff00; // Verde por defecto

    if (!oldStatus && newStatus.online) {
      // Servidor acaba de conectarse (primera vez o después de estar offline)
      notificationText = `🟢 **¡Servidor Online!**\n\n`;
      notificationText += `El servidor **${process.env.MC_HOST}:${process.env.MC_PORT}** está ahora **online**.\n`;
      notificationText += `👥 Jugadores: ${newStatus.players?.online || 0}/${newStatus.players?.max || 0}`;
      color = 0x00ff00;
    } else if (oldStatus?.online && !newStatus.online) {
      // Servidor acaba de desconectarse
      notificationText = `🔴 **Servidor Offline**\n\n`;
      notificationText += `El servidor **${process.env.MC_HOST}:${process.env.MC_PORT}** está ahora **offline**.\n`;
      notificationText += `Último estado conocido: ${oldStatus.players?.online || 0} jugadores conectados.`;
      color = 0xff0000;
    } else if (oldStatus && !oldStatus.online && newStatus.online) {
      // Servidor se reactiva después de estar offline
      notificationText = `🟢 **¡Servidor Online!**\n\n`;
      notificationText += `El servidor **${process.env.MC_HOST}:${process.env.MC_PORT}** se ha reactivado y está ahora **online**.\n`;
      notificationText += `👥 Jugadores: ${newStatus.players?.online || 0}/${newStatus.players?.max || 0}`;
      color = 0x00ff00;
    }

    if (notificationText) {
      const embed = new EmbedBuilder()
        .setTitle('📢 Cambio de Estado del Servidor')
        .setDescription(notificationText)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: `Servidor: ${process.env.MC_HOST}:${process.env.MC_PORT}` });

      await notificationChannel.send({ embeds: [embed] });
      console.log(`📢 Notificación de cambio de estado enviada al canal ${STATUS_CHANGE_CHANNEL_ID}`);
    }
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
}

/**
 * Genera el embed de estado formateado
 */
async function generateStatusEmbed() {
  try {
    const host = process.env.MC_HOST;
    const port = parseInt(process.env.MC_PORT);

    const status = await getMinecraftStatus(host, port);
    const now = Date.now();

    // Detectar cambio de estado y enviar notificación
    if (lastStatus !== null && lastStatus.online !== status.online) {
      await sendStatusChangeNotification(lastStatus, status);
      logStatusChange(status);
    } else if (lastStatus === null) {
      // Primera vez, registrar estado inicial
      logStatusChange(status);
    }

    lastStatus = status;

    const embed = new EmbedBuilder()
      .setTitle(`🎮 Estado del Servidor Minecraft`)
      .setDescription(`**${host}:${port}**`)
      .setTimestamp(now)
      .setFooter({ 
        text: `Última actualización`,
        iconURL: client.user?.displayAvatarURL()
      });

    if (status.online) {
      // Si es la primera vez que detectamos online, guardar el tiempo
      if (firstOnlineTime === null) {
        firstOnlineTime = Date.now();
      }

      // Calcular uptime estimado
      const uptimeMs = Date.now() - firstOnlineTime;
      const uptimeStr = formatUptime(uptimeMs);

      const fields = [
        {
          name: '🟢 Estado',
          value: '**Online**',
          inline: true
        },
        {
          name: '👥 Jugadores',
          value: `**${status.players.online}/${status.players.max}**`,
          inline: true
        },
        {
          name: '⏱️ Uptime',
          value: `**${uptimeStr}**`,
          inline: true
        }
      ];

      // Solo agregar versión si está disponible y no es "Desconocida"
      if (status.version && status.version !== 'Desconocida' && status.version.trim() !== '') {
        fields.push({
          name: '📦 Versión',
          value: `**${status.version}**`,
          inline: true
        });
      }

      // Solo mostrar lista de jugadores si hay jugadores conectados
      if (status.players.list.length > 0) {
        fields.push({
          name: '📋 Jugadores Conectados',
          value: status.players.list.slice(0, 10).join(', ') + (status.players.list.length > 10 ? ` *(+${status.players.list.length - 10} más)*` : ''),
          inline: false
        });
      }

      embed.setColor(0x00ff00).addFields(fields);
    } else {
      // Si está offline, resetear el tiempo de primera detección
      firstOnlineTime = null;

      embed.setColor(0xff0000) // Rojo
        .addFields(
          {
            name: '🔴 Estado',
            value: '**Offline / No responde**',
            inline: true
          },
          {
            name: '⏱️ Uptime',
            value: '**N/A**',
            inline: true
          }
        );

      if (status.error) {
        embed.addFields({
          name: '❌ Error',
          value: `\`${status.error}\``,
          inline: false
        });
      }
    }

    return embed;
  } catch (error) {
    console.error('Error al generar el embed:', error);
    
    const errorEmbed = new EmbedBuilder()
      .setTitle('❌ Error')
      .setDescription('Error al consultar el estado del servidor.')
      .setColor(0xff0000)
      .setTimestamp();
    
    return errorEmbed;
  }
}

/**
 * Actualiza el mensaje de estado en el canal
 */
async function updateStatusMessage() {
  try {
    const channelId = process.env.CHANNEL_ID;
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      console.error(`❌ No se pudo encontrar el canal con ID: ${channelId}`);
      return;
    }

    const embed = await generateStatusEmbed();

    if (statusMessageId) {
      try {
        // Intentar editar el mensaje existente
        const message = await channel.messages.fetch(statusMessageId);
        await message.edit({ embeds: [embed] });
        console.log(`✅ Mensaje actualizado: ${new Date().toLocaleTimeString()}`);
      } catch (error) {
        // Si el mensaje no existe o hay error, crear uno nuevo
        console.log('⚠️ No se pudo editar el mensaje, creando uno nuevo...');
        const newMessage = await channel.send({ embeds: [embed] });
        statusMessageId = newMessage.id;
        console.log(`✅ Nuevo mensaje creado: ${new Date().toLocaleTimeString()}`);
      }
    } else {
      // Si no hay mensaje guardado, crear uno nuevo
      const message = await channel.send({ embeds: [embed] });
      statusMessageId = message.id;
      console.log(`✅ Mensaje inicial creado: ${new Date().toLocaleTimeString()}`);
    }
  } catch (error) {
    console.error('Error al actualizar el mensaje de estado:', error);
  }
}

// Inicializar reproductor de música
initializePlayer(client);

// Listener para mensajes de Discord → Minecraft
client.on(Events.MessageCreate, async message => {
  // Ignorar mensajes del bot
  if (message.author.bot) return;
  
  // Solo procesar mensajes del canal configurado
  if (DISCORD_TO_MC_CHANNEL_ID && message.channel.id === DISCORD_TO_MC_CHANNEL_ID) {
    const content = message.content.trim();
    
    // Ignorar mensajes vacíos
    if (!content) return;
    
    // Formatear mensaje: "Usuario: Mensaje"
    const formattedMessage = `${message.author.displayName || message.author.username}: ${content}`;
    
    // Enviar a Minecraft
    const result = await sendMessageToMinecraft(formattedMessage);
    
    if (result.success) {
      console.log(`📤 Mensaje enviado a Minecraft: ${formattedMessage}`);
      // Opcional: agregar reacción de confirmación
      try {
        await message.react('✅');
      } catch (error) {
        // Ignorar errores de reacción
      }
    } else {
      // Solo mostrar error si no es por falta de configuración
      if (!result.error.includes('no está configurado')) {
        console.error(`❌ Error al enviar mensaje a Minecraft: ${result.error}`);
      }
      try {
        await message.react('❌');
      } catch (error) {
        // Ignorar errores de reacción
      }
    }
  }
});

// Handler de interacciones (comandos y botones)
client.on(Events.InteractionCreate, async interaction => {
  // Manejar botones del panel de música
  if (interaction.isButton()) {
    const queue = getQueue(interaction.guild.id);
    
    if (!queue) {
      await interaction.reply({ content: '❌ No hay música reproduciéndose', ephemeral: true });
      return;
    }

    if (interaction.customId === 'music_pause') {
      const result = await pauseResume(interaction.guild.id);
      if (result.success) {
        const embed = createPlayerEmbed(queue.currentTrack, queue);
        const panel = createControlPanel(queue);
        await interaction.update({ embeds: [embed], components: [panel] });
      } else {
        await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      }
      return;
    }

    if (interaction.customId === 'music_stop') {
      const result = await stopMusic(interaction.guild.id);
      if (result.success) {
        await interaction.update({ content: '⏹️ Música detenida', embeds: [], components: [] });
      } else {
        await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      }
      return;
    }

    if (interaction.customId === 'music_skip') {
      const result = await skipTrack(interaction.guild.id);
      if (result.success) {
        const newQueue = getQueue(interaction.guild.id);
        if (newQueue && newQueue.currentTrack) {
          const embed = createPlayerEmbed(newQueue.currentTrack, newQueue);
          const panel = createControlPanel(newQueue);
          await interaction.update({ embeds: [embed], components: [panel] });
        } else {
          await interaction.update({ content: '⏭️ Siguiente canción', embeds: [], components: [] });
        }
      } else {
        await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      }
      return;
    }

    if (interaction.customId === 'music_queue') {
      const queue = getQueue(interaction.guild.id);
      if (!queue || !queue.tracks || queue.tracks.length === 0) {
        await interaction.reply({ content: '📭 La cola está vacía', ephemeral: true });
        return;
      }

      const tracks = queue.tracks.slice(0, 10).map((track, index) => 
        `${index + 1}. **${track.title}** - ${track.author}`
      ).join('\n');

      const embed = new EmbedBuilder()
        .setTitle('📋 Cola de Reproducción')
        .setDescription(tracks)
        .setColor(0x1DB954);
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
  }

  // Manejar comandos slash
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'play') {
    await interaction.deferReply();
    
    const query = interaction.options.getString('cancion', true);
    const result = await playMusic(interaction, query);
    
    if (result.success) {
      const embed = createPlayerEmbed(result.track, result.queue);
      const panel = createControlPanel(result.queue);
      
      await interaction.editReply({ embeds: [embed], components: [panel] });
    } else {
      await interaction.editReply(`❌ Error: ${result.error}`);
    }
  }

  if (interaction.commandName === 'stop') {
    await interaction.deferReply();
    
    const result = await stopMusic(interaction.guild.id);
    
    if (result.success) {
      await interaction.editReply('⏹️ Música detenida');
    } else {
      await interaction.editReply(`❌ ${result.error}`);
    }
  }

  if (interaction.commandName === 'pause') {
    await interaction.deferReply();
    
    const result = await pauseResume(interaction.guild.id);
    
    if (result.success) {
      const action = result.paused ? '⏸️ Pausado' : '▶️ Reanudado';
      await interaction.editReply(action);
    } else {
      await interaction.editReply(`❌ ${result.error}`);
    }
  }

  if (interaction.commandName === 'queue') {
    await interaction.deferReply();
    
    const queue = getQueue(interaction.guild.id);
    
    if (!queue || !queue.tracks || queue.tracks.length === 0) {
      await interaction.editReply('📭 La cola está vacía');
      return;
    }

    const tracks = queue.tracks.slice(0, 10).map((track, index) => 
      `${index + 1}. **${track.title}** - ${track.author}`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('📋 Cola de Reproducción')
      .setDescription(tracks)
      .setColor(0x1DB954);
    
    await interaction.editReply({ embeds: [embed] });
  }
});

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log(`📡 Monitoreando servidor: ${process.env.MC_HOST}:${process.env.MC_PORT}`);
  console.log(`📺 Canal ID: ${process.env.CHANNEL_ID}`);
  console.log(`🔄 Actualizando estado cada ${UPDATE_INTERVAL / 1000} segundos...`);
  
  if (NOTIFICATION_CHANNEL_ID !== process.env.CHANNEL_ID) {
    console.log(`📢 Canal de notificaciones: ${NOTIFICATION_CHANNEL_ID}`);
  }

  if (DISCORD_TO_MC_CHANNEL_ID) {
    console.log(`💬 Canal Discord → Minecraft: ${DISCORD_TO_MC_CHANNEL_ID}`);
    if (process.env.RCON_PASSWORD) {
      console.log(`🔌 RCON configurado - Los mensajes se enviarán a Minecraft`);
      await connectRCON();
    } else {
      console.log(`⚠️ RCON no configurado - Los mensajes NO se enviarán a Minecraft`);
      console.log(`💡 Para habilitar: Agrega RCON_PASSWORD y RCON_PORT al .env`);
    }
  }

  // Actualizar inmediatamente al iniciar
  await updateStatusMessage();

  // Actualizar según el intervalo configurado
  setInterval(async () => {
    await updateStatusMessage();
  }, UPDATE_INTERVAL);
});

// Manejar errores
client.on(Events.Error, error => {
  console.error('Error del cliente Discord:', error);
});

process.on('unhandledRejection', error => {
  console.error('Error no manejado:', error);
});

// Cerrar conexiones al salir
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando bot...');
  await closeRCON();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando bot...');
  await closeRCON();
  process.exit(0);
});

// Conectar el bot
client.login(process.env.DISCORD_TOKEN);
