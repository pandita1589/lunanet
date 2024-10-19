// En tu archivo principal (server.js)
const express = require('express');
const { Client, UserFlagsBitField } = require('discord.js');
const path = require('path');
const config = require('./config.json');
const botDataRouter = require('./routes/botDataRouter');

const app = express();
const client = new Client({
    intents: [3276799], // Intents adecuados para tu bot
});

const PORT = 3001;

// Configura el motor de plantillas (si estás usando plantillas)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Configura los archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para asegurar que el bot está listo
app.use((req, res, next) => {
    req.client = client;
    next();
});

// Configura el enrutador
app.use('/', botDataRouter);

// Ruta para la página "Sobre Nosotros"
app.get('/dashboard', async (req, res) => {
    try {
        // Usa el botDataRouter para obtener los datos del bot
        const client = req.client;
        if (!client || !client.readyAt) {
            return res.status(503).send('Cliente del bot no disponible');
        }

        // Obtén los datos del bot
        let userCount = 0;
        client.guilds.cache.forEach(guild => {
            userCount += guild.memberCount;
        });
        const guildCount = client.guilds.cache.size;

        const commands = await client.application.commands.fetch();
        const commandsInfo = commands.map(command => ({
            name: command.name,
            description: command.description
        }));

        const botBanner = client.user.bannerURL() || 'https://i.imgur.com/Z2ffTsL.gif';
        const botDescription = client.user.description || '¡Soy un bot en desarrollo!';
        const botStatus = client.user.presence?.status || 'offline';
        const statusColors = {
            online: '#00ff00',
            idle: '#ffff00',
            dnd: '#ff0000',
            offline: '#808080'
        };
        const statusColor = statusColors[botStatus] || '#808080';

        const serverDetails = await Promise.all(client.guilds.cache.map(async guild => {
            try {
                const members = await guild.members.fetch({ cache: true, force: true });
                const botsCount = members.filter(member => member.user.bot).size;
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: guild.memberCount,
                    botCount: botsCount,
                    id: guild.id,
                    joinedAt: guild.joinedAt ? guild.joinedAt.toDateString() : 'No disponible',
                    banner: guild.bannerURL() || 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            } catch (error) {
                console.error(`Error al obtener los miembros del servidor ${guild.name}:`, error);
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: 'No disponible',
                    botCount: 'No disponible',
                    id: guild.id,
                    joinedAt: 'No disponible',
                    banner: 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            }
        }));

        // Obtener detalles del propietario del bot
        let owner = {};
        try {
            owner = await client.users.fetch(config.ownerId);
        } catch (error) {
            console.error('Error al obtener información del propietario del bot:', error);
        }

        // Crear el enlace de invitación del bot
        const botInvite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;

        res.render('dashboard', {
            users: userCount,
            guilds: guildCount,
            userTag: client.user.username,
            commands: commandsInfo,
            commandCount: commandsInfo.length,
            botAvatar: client.user.displayAvatarURL(),
            botBanner: botBanner,
            botDescription: botDescription,
            botStatus: botStatus,
            statusColor: statusColor,
            serverDetails: serverDetails,
            contactEmail: "palpley.studios@gmail.com",
            ownerTag: owner.tag || 'Desconocido', // Etiqueta del propietario del bot
            ownerAvatar: owner.displayAvatarURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg', // Avatar del propietario del bot
            botInvite: botInvite
        });
    } catch (error) {
        console.error('Error al obtener los datos del bot:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página "Sobre Nosotros"
app.get('/about', async (req, res) => {
    try {
        // Usa el botDataRouter para obtener los datos del bot
        const client = req.client;
        if (!client || !client.readyAt) {
            return res.status(503).send('Cliente del bot no disponible');
        }

        // Obtén los datos del bot
        let userCount = 0;
        client.guilds.cache.forEach(guild => {
            userCount += guild.memberCount;
        });
        const guildCount = client.guilds.cache.size;

        const commands = await client.application.commands.fetch();
        const commandsInfo = commands.map(command => ({
            name: command.name,
            description: command.description
        }));

        const botBanner = client.user.bannerURL() || 'https://i.imgur.com/Z2ffTsL.gif';
        const botDescription = client.user.description || '¡Soy un bot en desarrollo!';
        const botStatus = client.user.presence?.status || 'offline';
        const statusColors = {
            online: '#00ff00',
            idle: '#ffff00',
            dnd: '#ff0000',
            offline: '#808080'
        };
        const statusColor = statusColors[botStatus] || '#808080';

        const serverDetails = await Promise.all(client.guilds.cache.map(async guild => {
            try {
                const members = await guild.members.fetch({ cache: true, force: true });
                const botsCount = members.filter(member => member.user.bot).size;
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: guild.memberCount,
                    botCount: botsCount,
                    id: guild.id,
                    joinedAt: guild.joinedAt ? guild.joinedAt.toDateString() : 'No disponible',
                    banner: guild.bannerURL() || 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            } catch (error) {
                console.error(`Error al obtener los miembros del servidor ${guild.name}:`, error);
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: 'No disponible',
                    botCount: 'No disponible',
                    id: guild.id,
                    joinedAt: 'No disponible',
                    banner: 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            }
        }));

        // Obtener detalles del propietario del bot
        let owner = {};
        try {
            owner = await client.users.fetch(config.ownerId);
        } catch (error) {
            console.error('Error al obtener información del propietario del bot:', error);
        }

        // Crear el enlace de invitación del bot
        const botInvite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;


        res.render('about', {
            users: userCount,
            guilds: guildCount,
            userTag: client.user.username,
            commands: commandsInfo,
            commandCount: commandsInfo.length,
            botAvatar: client.user.displayAvatarURL(),
            botBanner: botBanner,
            botDescription: botDescription,
            botStatus: botStatus,
            statusColor: statusColor,
            serverDetails: serverDetails,
            contactEmail: "palpley.studios@gmail.com",
            ownerTag: owner.tag || 'Desconocido', // Etiqueta del propietario del bot
            ownerAvatar: owner.displayAvatarURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg', // Avatar del propietario del bot
            botInvite: botInvite
        });
    } catch (error) {
        console.error('Error al obtener los datos del bot:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/privacy-policy', async (req, res) => {
    try {
        // Usa el botDataRouter para obtener los datos del bot
        const client = req.client;
        if (!client || !client.readyAt) {
            return res.status(503).send('Cliente del bot no disponible');
        }

        // Obtén los datos del bot
        let userCount = 0;
        client.guilds.cache.forEach(guild => {
            userCount += guild.memberCount;
        });
        const guildCount = client.guilds.cache.size;

        const commands = await client.application.commands.fetch();
        const commandsInfo = commands.map(command => ({
            name: command.name,
            description: command.description
        }));

        const botBanner = client.user.bannerURL() || 'https://i.imgur.com/Z2ffTsL.gif';
        const botDescription = client.user.description || '¡Soy un bot en desarrollo!';
        const botStatus = client.user.presence?.status || 'offline';
        const statusColors = {
            online: '#00ff00',
            idle: '#ffff00',
            dnd: '#ff0000',
            offline: '#808080'
        };
        const statusColor = statusColors[botStatus] || '#808080';

        const serverDetails = await Promise.all(client.guilds.cache.map(async guild => {
            try {
                const members = await guild.members.fetch({ cache: true, force: true });
                const botsCount = members.filter(member => member.user.bot).size;
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: guild.memberCount,
                    botCount: botsCount,
                    id: guild.id,
                    joinedAt: guild.joinedAt ? guild.joinedAt.toDateString() : 'No disponible',
                    banner: guild.bannerURL() || 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            } catch (error) {
                console.error(`Error al obtener los miembros del servidor ${guild.name}:`, error);
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: 'No disponible',
                    botCount: 'No disponible',
                    id: guild.id,
                    joinedAt: 'No disponible',
                    banner: 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            }
        }));

        // Obtener detalles del propietario del bot
        let owner = {};
        try {
            owner = await client.users.fetch(config.ownerId);
        } catch (error) {
            console.error('Error al obtener información del propietario del bot:', error);
        }

        // Crear el enlace de invitación del bot
        const botInvite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;

        res.render('privacy-policy', {
            users: userCount,
            guilds: guildCount,
            userTag: client.user.username,
            commands: commandsInfo,
            commandCount: commandsInfo.length,
            botAvatar: client.user.displayAvatarURL(),
            botBanner: botBanner,
            botDescription: botDescription,
            botStatus: botStatus,
            statusColor: statusColor,
            serverDetails: serverDetails,
            contactEmail: "palpley.studios@gmail.com",
            ownerTag: owner.tag || 'Desconocido', // Etiqueta del propietario del bot
            ownerAvatar: owner.displayAvatarURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg', // Avatar del propietario del bot
            botInvite: botInvite
        });
    } catch (error) {
        console.error('Error al obtener los datos del bot:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/terms', async (req, res) => {
    try {
        // Usa el botDataRouter para obtener los datos del bot
        const client = req.client;
        if (!client || !client.readyAt) {
            return res.status(503).send('Cliente del bot no disponible');
        }

        // Obtén los datos del bot
        let userCount = 0;
        client.guilds.cache.forEach(guild => {
            userCount += guild.memberCount;
        });
        const guildCount = client.guilds.cache.size;

        const commands = await client.application.commands.fetch();
        const commandsInfo = commands.map(command => ({
            name: command.name,
            description: command.description
        }));

        const botBanner = client.user.bannerURL() || 'https://i.imgur.com/Z2ffTsL.gif';
        const botDescription = client.user.description || '¡Soy un bot en desarrollo!';
        const botStatus = client.user.presence?.status || 'offline';
        const statusColors = {
            online: '#00ff00',
            idle: '#ffff00',
            dnd: '#ff0000',
            offline: '#808080'
        };
        const statusColor = statusColors[botStatus] || '#808080';

        const serverDetails = await Promise.all(client.guilds.cache.map(async guild => {
            try {
                const members = await guild.members.fetch({ cache: true, force: true });
                const botsCount = members.filter(member => member.user.bot).size;
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: guild.memberCount,
                    botCount: botsCount,
                    id: guild.id,
                    joinedAt: guild.joinedAt ? guild.joinedAt.toDateString() : 'No disponible',
                    banner: guild.bannerURL() || 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            } catch (error) {
                console.error(`Error al obtener los miembros del servidor ${guild.name}:`, error);
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: 'No disponible',
                    botCount: 'No disponible',
                    id: guild.id,
                    joinedAt: 'No disponible',
                    banner: 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            }
        }));

        // Obtener detalles del propietario del bot
        let owner = {};
        try {
            owner = await client.users.fetch(config.ownerId);
        } catch (error) {
            console.error('Error al obtener información del propietario del bot:', error);
        }

         // Crear el enlace de invitación del bot
         const botInvite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;

        res.render('terms', {
            users: userCount,
            guilds: guildCount,
            userTag: client.user.username,
            commands: commandsInfo,
            commandCount: commandsInfo.length,
            botAvatar: client.user.displayAvatarURL(),
            botBanner: botBanner,
            botDescription: botDescription,
            botStatus: botStatus,
            statusColor: statusColor,
            serverDetails: serverDetails,
            contactEmail: "palpley.studios@gmail.com",
            ownerTag: owner.tag || 'Desconocido', // Etiqueta del propietario del bot
            ownerAvatar: owner.displayAvatarURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg', // Avatar del propietario del bot
            botInvite: botInvite
        });
    } catch (error) {
        console.error('Error al obtener los datos del bot:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/faq', async (req, res) => {
    try {
        // Usa el botDataRouter para obtener los datos del bot
        const client = req.client;
        if (!client || !client.readyAt) {
            return res.status(503).send('Cliente del bot no disponible');
        }

        // Obtén los datos del bot
        let userCount = 0;
        client.guilds.cache.forEach(guild => {
            userCount += guild.memberCount;
        });
        const guildCount = client.guilds.cache.size;

        const commands = await client.application.commands.fetch();
        const commandsInfo = commands.map(command => ({
            name: command.name,
            description: command.description
        }));

        const botBanner = client.user.bannerURL() || 'https://i.imgur.com/Z2ffTsL.gif';
        const botDescription = client.user.description || '¡Soy un bot en desarrollo!';
        const botStatus = client.user.presence?.status || 'offline';
        const statusColors = {
            online: '#00ff00',
            idle: '#ffff00',
            dnd: '#ff0000',
            offline: '#808080'
        };
        const statusColor = statusColors[botStatus] || '#808080';

        const serverDetails = await Promise.all(client.guilds.cache.map(async guild => {
            try {
                const members = await guild.members.fetch({ cache: true, force: true });
                const botsCount = members.filter(member => member.user.bot).size;
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: guild.memberCount,
                    botCount: botsCount,
                    id: guild.id,
                    joinedAt: guild.joinedAt ? guild.joinedAt.toDateString() : 'No disponible',
                    banner: guild.bannerURL() || 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            } catch (error) {
                console.error(`Error al obtener los miembros del servidor ${guild.name}:`, error);
                return {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg',
                    userCount: 'No disponible',
                    botCount: 'No disponible',
                    id: guild.id,
                    joinedAt: 'No disponible',
                    banner: 'https://i.pinimg.com/originals/3f/92/3b/3f923b94ed539dd806d7a50168597bd0.gif'
                };
            }
        }));

        // Obtener detalles del propietario del bot
        let owner = {};
        try {
            owner = await client.users.fetch(config.ownerId);
        } catch (error) {
            console.error('Error al obtener información del propietario del bot:', error);
        }

         // Crear el enlace de invitación del bot
         const botInvite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;

        res.render('faq', {
            users: userCount,
            guilds: guildCount,
            userTag: client.user.username,
            commands: commandsInfo,
            commandCount: commandsInfo.length,
            botAvatar: client.user.displayAvatarURL(),
            botBanner: botBanner,
            botDescription: botDescription,
            botStatus: botStatus,
            statusColor: statusColor,
            serverDetails: serverDetails,
            contactEmail: "palpley.studios@gmail.com",
            ownerTag: owner.tag || 'Desconocido', // Etiqueta del propietario del bot
            ownerAvatar: owner.displayAvatarURL() || 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg', // Avatar del propietario del bot
            botInvite: botInvite
        });
    } catch (error) {
        console.error('Error al obtener los datos del bot:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Maneja errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Maneja errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Inicia el bot
client.once('ready', () => {
    console.log('Bot está listo y conectado');

    // Inicia el servidor Express
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
});

client.login(config.token);
