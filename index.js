const express = require('express');
const path = require('path');
const { createClient } = require('@libsql/client');
const { renderBannerItem, renderBannerItemFromJson } = require('mc-banner-renderer');
const dotenv = require('dotenv');
dotenv.config()

let db;

(async () => {
    db = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN
    });

    console.log('Database connected successfully!');
})();

const app = express();
const port = 3000;

// app.use()

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    res.render('index', {
        title: 'WBC'
    });
});

app.get('/guilds', async (req, res) => {
    const result = await db.execute('SELECT * FROM guilds');
    const guilds = result.rows;
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
    const guildResult = await db.execute({
        sql: 'SELECT * FROM guilds WHERE id = ?',
        args: [id]
    });
    const guild = guildResult.rows[0];
    const membersResult = await db.execute({
        sql: 'SELECT * FROM guild_members WHERE guild_id = ?',
        args: [id]
    });
    const members = membersResult.rows;
    const relationsResult = await db.execute({
        sql: 'SELECT * FROM guild_relations WHERE guild1_id = ? OR guild2_id = ?',
        args: [id, id]
    });
    const relations = relationsResult.rows;

    console.log(relations)
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
    const guildResult = await db.execute({
        sql: 'SELECT * FROM guilds WHERE id = ?',
        args: [guildId]
    });
    const guild = guildResult.rows[0];
    const dataURL = await renderBannerItemFromJson(guild.banner_json, 8);
    const buffer = Buffer.from(dataURL, 'base64');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});

module.exports = app;