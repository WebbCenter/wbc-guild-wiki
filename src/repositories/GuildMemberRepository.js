const { getDatabase } = require('../config/database');

class GuildMemberRepository {
    async findById(id) {
        const db = getDatabase();
        const result = await db.execute({
            sql: 'SELECT * FROM guild_members WHERE id = ?',
            args: [id]
        });

        return result.rows[0];
    }

    async findByGuildId(guildId) {
        const db = getDatabase();
        const result = await db.execute({
            sql: 'SELECT * FROM guild_members WHERE guild_id = ?',
            args: [guildId]
        });

        return result.rows;
    }

    async findByPlayerName(playerName) {
        const db = getDatabase();
        const result = await db.execute({
            sql: "SELECT * FROM guild_members WHERE player_name LIKE ? LIMIT 3",
            args: ['%' + playerName + '%']
        });

        return result.rows;
    }
}

module.exports = new GuildMemberRepository();