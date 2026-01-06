const GuildMemberRepository = require('../repositories/GuildMemberRepository');

class GuildMemberService {
    async getById(id) {
        return await GuildMemberRepository.findById(id);
    }

    async getByGuildId(guildId) {
        return await GuildMemberRepository.findByGuildId(guildId);
    }

    async getByPlayerName(playerName) {
        return await GuildMemberRepository.findByPlayerName(playerName);
    }
}

module.exports = new GuildMemberService();