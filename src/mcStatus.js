const GameDig = require('gamedig');

/**
 * Consulta el estado del servidor de Minecraft
 * @param {string} host - Host del servidor
 * @param {number} port - Puerto del servidor
 * @returns {Promise<Object>} Objeto con el estado del servidor
 */
async function getMinecraftStatus(host, port) {
  const startTime = Date.now();
  
  try {
    const state = await GameDig.query({
      type: 'minecraft',
      host: host,
      port: port,
      timeout: 5000 // 5 segundos de timeout
    });

    const latency = Date.now() - startTime;

    // Manejar diferentes estructuras de datos de gamedig
    const playersList = state.players || [];
    const playersOnline = Array.isArray(playersList) ? playersList.length : (state.numplayers || 0);
    const playersMax = state.maxplayers || 0;
    
    // Extraer nombres de jugadores si están disponibles
    let playersNames = [];
    if (Array.isArray(playersList) && playersList.length > 0) {
      playersNames = playersList.map(p => {
        if (typeof p === 'string') return p;
        return p.name || p.name_orig || 'Desconocido';
      });
    }

    return {
      online: true,
      players: {
        online: playersOnline,
        max: playersMax,
        list: playersNames
      },
      version: state.raw?.version || state.version || 'Desconocida',
      motd: state.name || state.motd || 'Servidor de Minecraft',
      latency: latency,
      timestamp: Date.now()
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    
    // Si el servidor no responde o hay error de conexión
    return {
      online: false,
      error: error.message,
      latency: latency,
      timestamp: Date.now()
    };
  }
}

module.exports = { getMinecraftStatus };

