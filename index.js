const express = require('express');
const path = require('path');
const { initDatabase } = require('./src/config/database');
const GuildService = require('./src/services/GuildService');
const { renderBannerItemFromJson } = require('mc-banner-renderer');
const dotenv = require('dotenv');
const GuildMemberService = require('./src/services/GuildMemberService');
const SearchResponseMapper = require('./src/mappers/SearchResponseMapper');
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

    if (!guild)
        return res.status(404).json({ message: `Guild with id '${id}' not found.` });

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

app.get('/api/player-skin/:id', async (req, res) => {
    const playerId = req.params.id;
    const player = await GuildMemberService.getById(playerId);

    let response = null;
    let data = null;

    response = await fetch('https://api.geysermc.org/v2/xbox/xuid/' + player.player_name.replace(".", ""));
    data = await response.json();
    let xuid = data.xuid;

    response = await fetch('https://api.geysermc.org/v2/skin/' + xuid);
    data = await response.json();
    let textureId = data.texture_id;

    response = await fetch('https://render.mineskin.org/render?overlay=true&body=true&scale=10&slim=true&url=https://textures.minecraft.net/texture/' + textureId);
    data = await response.arrayBuffer();
    const buffer = Buffer.from(data, 'base64');

    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

app.get('/api/search/', async (req, res) => {
    const { q, type } = req.query;
    const allowedTypes = ['player', 'guild'];

    if (!q || q == '')
        return res.status(400).json({ message: "Query parameter 'q' is required." })

    let result = [];
    let player = null;
    let guild = null;

    switch (type) {
        case allowedTypes[0]:
            player = await GuildMemberService.getByPlayerName(q);
            result = SearchResponseMapper.mapToResponse(player);
            break;
        case allowedTypes[1]:
            guild = await GuildService.getByName(q);
            result = SearchResponseMapper.mapToResponse(guild);
            break;
        default:
            player = await GuildMemberService.getByPlayerName(q);
            guild = await GuildService.getByName(q);
            result = result.concat(SearchResponseMapper.mapToResponse(player), SearchResponseMapper.mapToResponse(guild));
            break;
    }

    res.status(200).json(result);
});

(async () => {
    await initDatabase();

    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}/`);
    });
})();

module.exports = app;