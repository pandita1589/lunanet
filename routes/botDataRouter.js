const { Router } = require('express');
const router = Router();
const config = require('../config.json'); // Ajusta la ruta según tu estructura de proyecto
const { UserFlagsBitField } = require('discord.js'); // Importa UserFlagsBitField

router.get('/', async (req, res) => {
    const client = req.client;

    if (!client || !client.readyAt) {
        return res.status(503).send('Cliente del bot no disponible');
    }

    try {
        // Obtén la información del bot
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
            owner = {
                tag: 'Desconocido',
                displayAvatarURL: () => 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg'
            };
        }

        // Crear el enlace de invitación del bot
        const botInvite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;

        // Renderizar la vista solo una vez
        res.render('inicio', {
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
            ownerTag: owner.tag, // Etiqueta del propietario del bot
            ownerAvatar: owner.displayAvatarURL(), // Avatar del propietario del bot
            botInvite: botInvite // Enlace de invitación del bot
        });
    } catch (error) {
        console.error('Error al obtener los datos del bot:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
