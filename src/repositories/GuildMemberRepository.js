const { getDatabase } = require('../config/database');

class GuildMemberRepository {
    async findByGuildId(guildId) {
        const db = getDatabase();
        const result = await db.execute({
            sql: 'SELECT * FROM guild_members WHERE guild_id = ?',
            args: [guildId]
        });

        return result.rows;
    }
}

module.exports = new GuildMemberRepository();