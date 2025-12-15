require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { getMinecraftStatus } = require('./mcStatus');

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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
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

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log(`📡 Monitoreando servidor: ${process.env.MC_HOST}:${process.env.MC_PORT}`);
  console.log(`📺 Canal ID: ${process.env.CHANNEL_ID}`);
  console.log(`🔄 Actualizando estado cada ${UPDATE_INTERVAL / 1000} segundos...`);
  
  if (NOTIFICATION_CHANNEL_ID !== process.env.CHANNEL_ID) {
    console.log(`📢 Canal de notificaciones: ${NOTIFICATION_CHANNEL_ID}`);
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

// Conectar el bot
client.login(process.env.DISCORD_TOKEN);
