const express = require('express');
const path = require('path');
const { initDatabase } = require('./src/config/database');
const GuildService = require('./src/services/GuildService');
const { renderBannerItem, renderBannerItemFromJson } = require('mc-banner-renderer');
const dotenv = require('dotenv');
dotenv.config()

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    res.render('index', {
        title: 'WBC'
    });
});

app.get('/guilds', async (req, res) => {
    const guilds = await GuildService.getAllGuilds();
    const baseURL = `${req.protocol}://${req.get('host')}`;

    res.render('guilds', {
        title: 'Guilda',
        guilds,
        maxMembers: 6,
        baseURL
    });
});

app.get('/guild/:id', async (req, res) => {
    const { id } = req.params;
    const { guild, members, relations } = await GuildService.getGuildDetails(id);
    const baseURL = `${req.protocol}://${req.get('host')}`;

    res.render('guild', {
        title: `${guild.name} (Guilda)`,
        guild,
        members,
        relations,
        baseURL
    });
});

app.get('/api/guild-banner/:id', async (req, res) => {
    const guildId = req.params.id;
    const guild = await GuildService.getById(guildId);
    const dataURL = await renderBannerItemFromJson(guild.banner_json, 8);
    const buffer = Buffer.from(dataURL, 'base64');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

(async () => {
    await initDatabase();
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}/`);
    });
})();

module.exports = app;