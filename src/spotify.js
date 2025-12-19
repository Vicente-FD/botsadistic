const { Player } = require('discord-player');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

let player = null;

/**
 * Inicializa el reproductor de música
 */
function initializePlayer(client) {
  // Intentar usar ffmpeg-static si está disponible
  let ffmpegPath = null;
  try {
    const ffmpegStatic = require('ffmpeg-static');
    ffmpegPath = ffmpegStatic;
    console.log('✅ FFmpeg encontrado (ffmpeg-static)');
  } catch (error) {
    console.warn('⚠️ ffmpeg-static no encontrado, usando FFmpeg del sistema');
  }

  player = new Player(client, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    },
    ...(ffmpegPath && { ffmpegPath: ffmpegPath })
  });

  // Cargar extractors manualmente para asegurar que funcionen
  try {
    const { Extractor } = require('@discord-player/extractor');
    if (Extractor && typeof player.extractors.register === 'function') {
      player.extractors.register(Extractor, {});
      console.log('✅ Extractors de música cargados');
    } else {
      // Intentar cargar por defecto
      if (typeof player.extractors.loadDefault === 'function') {
        player.extractors.loadDefault();
        console.log('✅ Extractors cargados (loadDefault)');
      }
    }
  } catch (error) {
    console.warn('⚠️ No se pudieron cargar extractors automáticamente:', error.message);
    console.log('💡 Los extractors se cargarán cuando se use por primera vez');
  }

  player.on('error', (error) => {
    console.error('❌ Error del reproductor:', error);
  });

  player.on('playerError', (queue, error) => {
    console.error('❌ Error en la cola:', error);
  });

  player.on('trackStart', (queue, track) => {
    console.log(`🎵 Reproduciendo: ${track.title} - ${track.author}`);
  });

  player.on('trackEnd', (queue, track) => {
    console.log(`✅ Terminó: ${track.title}`);
  });

  player.on('debug', (message) => {
    // Solo mostrar debug si hay problemas
    if (message.includes('error') || message.includes('failed')) {
      console.log(`🔍 Debug: ${message}`);
    }
  });

  console.log('✅ Reproductor de música inicializado');
  console.log('📻 Fuentes soportadas: YouTube, Spotify (URLs), SoundCloud, y más');
  return player;
}

/**
 * Reproduce música desde Spotify o YouTube
 */
async function playMusic(interaction, query) {
  try {
    if (!player) {
      return { success: false, error: 'Reproductor no inicializado' };
    }

    // Verificar si el usuario está en un canal de voz
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return { success: false, error: 'Debes estar en un canal de voz' };
    }

    // Verificar permisos del bot
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return { success: false, error: 'No tengo permisos para conectarme o hablar en este canal de voz' };
    }

    // Buscar la canción usando el método correcto de discord-player v6
    let searchResult;
    try {
      searchResult = await player.search(query, {
        requestedBy: interaction.user,
        searchEngine: 'youtube' // Forzar YouTube como fuente principal
      });
    } catch (searchError) {
      console.error('Error en búsqueda:', searchError);
      return { success: false, error: `Error al buscar: ${searchError.message}` };
    }

    if (!searchResult || !searchResult.tracks || searchResult.tracks.length === 0) {
      return { success: false, error: 'No se encontraron resultados. Intenta con una URL de YouTube o un nombre más específico.' };
    }

    const track = searchResult.tracks[0];
    
    // Obtener o crear la cola
    let queue = player.nodes.get(interaction.guild.id);
    
    if (!queue) {
      queue = player.nodes.create(interaction.guild, {
        metadata: {
          channel: interaction.channel
        },
        selfDeaf: false
      });
    }

    // Conectar al canal de voz si no está conectado
    try {
      if (!queue.connection) {
        await queue.connect(voiceChannel);
      }
    } catch (error) {
      console.error('Error al conectar al canal de voz:', error);
      queue.delete();
      return { success: false, error: `No pude unirme al canal de voz: ${error.message}` };
    }

    // Agregar track a la cola
    queue.addTrack(track);
    
    // Reproducir si no está reproduciendo
    if (!queue.node.isPlaying()) {
      await queue.node.play();
    }

    return {
      success: true,
      track: track,
      queue: queue
    };
  } catch (error) {
    console.error('Error al reproducir música:', error);
    return { success: false, error: `Error: ${error.message}` };
  }
}

/**
 * Detiene la reproducción
 */
async function stopMusic(guildId) {
  try {
    if (!player) {
      return { success: false, error: 'Reproductor no inicializado' };
    }

    const queue = player.nodes.get(guildId);
    if (!queue) {
      return { success: false, error: 'No hay música reproduciéndose' };
    }

    queue.delete();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Pausa/Reanuda la reproducción
 */
async function pauseResume(guildId) {
  try {
    if (!player) {
      return { success: false, error: 'Reproductor no inicializado' };
    }

    const queue = player.nodes.get(guildId);
    if (!queue) {
      return { success: false, error: 'No hay música en la cola' };
    }

    const isPaused = queue.node.isPaused();
    
    if (isPaused) {
      queue.node.resume();
      return { success: true, paused: false };
    } else {
      queue.node.pause();
      return { success: true, paused: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene la cola actual
 */
function getQueue(guildId) {
  if (!player) {
    return null;
  }
  return player.nodes.get(guildId);
}

/**
 * Salta a la siguiente canción
 */
async function skipTrack(guildId) {
  try {
    if (!player) {
      return { success: false, error: 'Reproductor no inicializado' };
    }

    const queue = player.nodes.get(guildId);
    if (!queue || !queue.node.isPlaying()) {
      return { success: false, error: 'No hay música reproduciéndose' };
    }

    queue.node.skip();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Crea el panel de control con botones
 */
function createControlPanel(queue) {
  if (!queue) {
    return new ActionRowBuilder();
  }

  const isPlaying = queue.node.isPlaying();
  const isPaused = queue.node.isPaused();
  const hasNext = queue.tracks && queue.tracks.length > 0;

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('music_pause')
        .setLabel(isPaused ? '▶️ Reanudar' : '⏸️ Pausar')
        .setStyle(isPaused ? ButtonStyle.Success : ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('music_stop')
        .setLabel('⏹️ Detener')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('music_skip')
        .setLabel('⏭️ Siguiente')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!hasNext),
      new ButtonBuilder()
        .setCustomId('music_queue')
        .setLabel('📋 Cola')
        .setStyle(ButtonStyle.Secondary)
    );

  return row;
}

/**
 * Crea el embed del reproductor
 */
function createPlayerEmbed(track, queue) {
  const queueLength = queue && queue.tracks ? queue.tracks.length : 0;
  const isPaused = queue && queue.node ? queue.node.isPaused() : false;
  
  const embed = new EmbedBuilder()
    .setTitle('🎵 Reproduciendo')
    .setDescription(`**${track.title}**\n${track.author}`)
    .setThumbnail(track.thumbnail)
    .setColor(0x1DB954)
    .setFooter({ text: `Duración: ${track.duration || 'N/A'} | Cola: ${queueLength} canciones` });

  if (isPaused) {
    embed.setDescription(`⏸️ **${track.title}**\n${track.author}`);
  }

  return embed;
}

module.exports = {
  initializePlayer,
  playMusic,
  stopMusic,
  pauseResume,
  getQueue,
  skipTrack,
  createControlPanel,
  createPlayerEmbed
};

