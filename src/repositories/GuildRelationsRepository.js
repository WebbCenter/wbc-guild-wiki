const { getDatabase } = require('../config/database');

class GuildRelationsRepository {
    async findByGuildId(guildId) {
        const db = getDatabase();
        const result = await db.execute({
            sql: 'SELECT * FROM guild_relations WHERE guild1_id = ? OR guild2_id = ?',
            args: [guildId, guildId]
        });

        return result.rows;
    }
}

module.exports = new GuildRelationsRepository();