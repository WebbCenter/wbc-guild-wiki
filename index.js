const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { renderBannerItem, renderBannerItemFromJson } = require('mc-banner-renderer');

let db;

(async () => {
    db = await open({
        filename: path.join(__dirname, 'guild.db'),
        driver: sqlite3.Database
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
    const guilds = await db.all('SELECT * FROM guilds')

    await Promise.all(guilds.map(async (guild) => {
        const banner = await renderBannerItemFromJson(guild.banner_json, 8);
        guild.bannerBase64 = banner;
    }));

    res.render('guilds', {
        title: 'Guildas',
        guilds
    });
});

app.get('/guild/:id', async (req, res) => {
    const { id } = req.params;
    const guild = await db.get('SELECT * FROM guilds WHERE id = ' + id);
    const members = await db.all('SELECT * FROM guild_members WHERE guild_id = ' + id);
    const dataURL = await renderBannerItemFromJson(guild.banner_json, 8);

    console.log(guild)

    res.render('guild', {
        title: `${guild.name} (Guilda)`,
        guildBanner: dataURL,
        guild,
        members
    });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});

module.exports = app;