const { RCON } = require('minecraft-server-util');
const dns = require('dns').promises;

let rconClient = null;

/**
 * Resuelve un dominio a IP
 */
async function resolveHost(hostname) {
  try {
    // Si ya es una IP, devolverla directamente
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return hostname;
    }
    
    // Intentar resolver el dominio
    const addresses = await dns.resolve4(hostname);
    if (addresses && addresses.length > 0) {
      console.log(`🔍 Resuelto ${hostname} → ${addresses[0]}`);
      return addresses[0];
    }
    return hostname;
  } catch (error) {
    console.warn(`⚠️ No se pudo resolver ${hostname}, usando directamente:`, error.message);
    return hostname;
  }
}

/**
 * Conecta al servidor RCON
 */
async function connectRCON() {
  try {
    // Usar RCON_HOST si está configurado, sino usar MC_HOST
    let host = String(process.env.RCON_HOST || process.env.MC_HOST || '').trim();
    const port = parseInt(process.env.RCON_PORT) || 25575;
    const password = String(process.env.RCON_PASSWORD || '').trim();

    if (!password) {
      throw new Error('RCON_PASSWORD no está configurado');
    }

    if (!host) {
      throw new Error('MC_HOST o RCON_HOST no está configurado');
    }

    // Intentar resolver el dominio a IP si no es una IP
    host = await resolveHost(host);

    // Crear nueva instancia de RCON
    rconClient = new RCON();
    
    // Conectar con host y port
    await rconClient.connect(host, port);
    await rconClient.login(password);
    
    console.log(`✅ Conectado a RCON: ${host}:${port}`);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar RCON:', error.message);
    console.error('💡 Sugerencia: Verifica que RCON esté habilitado en el servidor y que uses la IP correcta');
    rconClient = null;
    return false;
  }
}

/**
 * Ejecuta un comando en el servidor Minecraft
 */
async function executeCommand(command) {
  try {
    if (!rconClient) {
      const connected = await connectRCON();
      if (!connected) {
        throw new Error('No se pudo conectar a RCON');
      }
    }

    const response = await rconClient.execute(command);
    return { success: true, response };
  } catch (error) {
    console.error('Error al ejecutar comando RCON:', error.message);
    
    // Intentar reconectar
    if (error.message.includes('not connected') || error.message.includes('closed')) {
      rconClient = null;
      const connected = await connectRCON();
      if (connected) {
        try {
          const response = await rconClient.execute(command);
          return { success: true, response };
        } catch (retryError) {
          return { success: false, error: retryError.message };
        }
      }
    }
    
    return { success: false, error: error.message };
  }
}

/**
 * Envía un mensaje al chat de Minecraft usando tellraw
 */
async function sendMessageToMinecraft(message) {
  // Verificar si RCON está configurado
  if (!process.env.RCON_PASSWORD) {
    return { success: false, error: 'RCON no está configurado. Agrega RCON_PASSWORD y RCON_PORT al .env' };
  }

  // Escapar comillas y caracteres especiales para JSON
  const escapedMessage = message
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');

  const command = `tellraw @a {"text":"${escapedMessage}","color":"red","bold":true}`;
  
  return await executeCommand(command);
}

/**
 * Cierra la conexión RCON
 */
async function closeRCON() {
  if (rconClient) {
    try {
      rconClient.close();
      rconClient = null;
      console.log('✅ Conexión RCON cerrada');
    } catch (error) {
      console.error('Error al cerrar RCON:', error.message);
    }
  }
}

module.exports = {
  connectRCON,
  executeCommand,
  sendMessageToMinecraft,
  closeRCON
};

