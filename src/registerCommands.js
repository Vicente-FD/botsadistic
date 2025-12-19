require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'estado',
    description: 'Muestra el estado del servidor de Minecraft'
  },
  {
    name: 'play',
    description: 'Reproduce música desde Spotify o YouTube',
    options: [
      {
        name: 'cancion',
        type: 3, // STRING
        description: 'Nombre de la canción o URL de Spotify/YouTube',
        required: true
      }
    ]
  },
  {
    name: 'stop',
    description: 'Detiene la reproducción de música'
  },
  {
    name: 'pause',
    description: 'Pausa o reanuda la reproducción'
  },
  {
    name: 'queue',
    description: 'Muestra la cola de reproducción'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Iniciando registro de comandos slash...');

    const guildId = process.env.GUILD_ID;
    const clientId = process.env.DISCORD_CLIENT_ID;
    
    if (!guildId) {
      throw new Error('GUILD_ID no está definido en las variables de entorno');
    }
    
    if (!clientId) {
      throw new Error('DISCORD_CLIENT_ID no está definido en las variables de entorno');
    }

    // Registrar comandos solo en el guild especificado
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('✅ Comandos slash registrados exitosamente en el guild!');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
    if (error.code === 50001) {
      console.error('💡 Asegúrate de que el bot esté invitado al servidor con los permisos correctos.');
    }
    process.exit(1);
  }
})();

