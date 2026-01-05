const { getDatabase } = require('../config/database');

class GuildRepository {
    async findAll() {
        const db = getDatabase();
        const result = await db.execute('SELECT * FROM guilds');
        
        return result.rows;
    }

    async findById(id) {
        const db = getDatabase();
        const result = await db.execute({
            sql: 'SELECT * FROM guilds WHERE id = ?',
            args: [id]
        });

        return result.rows[0];
    }
}

module.exports = new GuildRepository();