const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { renderBannerItem, renderBannerItemFromJson } = require('mc-banner-renderer');

let db;
let dbPromise;

// Inicializa o banco de dados
dbPromise = (async () => {
    try {
        const dbPath = process.env.VERCEL 
            ? path.join(process.cwd(), 'guild.db')
            : path.join(__dirname, 'guild.db');
        
        console.log('Trying to connect to database at:', dbPath);
        
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READONLY
        });

        console.log('Database connected successfully!');
        return db;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
})();

const app = express();
const port = 3000;

// Middleware para garantir que o DB está conectado
app.use(async (req, res, next) => {
    if (!db) {
        try {
            await dbPromise;
        } catch (error) {
            return res.status(500).send('Database connection failed: ' + error.message);
        }
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    res.render('index', {
        title: 'WBC'
    });
});

app.get('/guilds', async (req, res) => {
    try {
        const guilds = await db.all('SELECT * FROM guilds');
        const baseURL = `${req.protocol}://${req.get('host')}`;

        res.render('guilds', {
            title: 'Guilda',
            guilds,
            maxMembers: 6,
            baseURL
        });
    } catch (error) {
        console.error('Error fetching guilds:', error);
        res.status(500).send('Error loading guilds: ' + error.message);
    }
});

app.get('/guild/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const guild = await db.get('SELECT * FROM guilds WHERE id = ?', id);
        const members = await db.all('SELECT * FROM guild_members WHERE guild_id = ?', id);
        const relations = await db.all(
            'SELECT * FROM guild_relations WHERE guild1_id = ? OR guild2_id = ?',
            id, id
        );

        console.log(relations)
        const baseURL = `${req.protocol}://${req.get('host')}`;

        res.render('guild', {
            title: `${guild.name} (Guilda)`,
            guild,
            members,
            relations,
            baseURL
        });
    } catch (error) {
        console.error('Error fetching guild:', error);
        res.status(500).send('Error loading guild: ' + error.message);
    }
});

app.get('/api/guild-banner/:id', async (req, res) => {
    try {
        const guildId = req.params.id;
        const guild = await db.get('SELECT * FROM guilds WHERE id = ?', guildId);
        const dataURL = await renderBannerItemFromJson(guild.banner_json, 8);
        const buffer = Buffer.from(dataURL, 'base64');
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        console.error('Error generating banner:', error);
        res.status(500).send('Error generating banner: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});

module.exports = app;