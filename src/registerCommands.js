require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'estado',
    description: 'Muestra el estado del servidor de Minecraft'
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

