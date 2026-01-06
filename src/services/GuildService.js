const GuildRepository = require('../repositories/GuildRepository');
const GuildMemberRepository = require('../repositories/GuildMemberRepository');
const GuildRelationsRepository = require('../repositories/GuildRelationsRepository');

class GuildService {
    async getAllGuilds() {
        return await GuildRepository.findAll();
    }

    async getById(id) {
        return await GuildRepository.findById(id);
    }

    async getByName(name) {
        return await GuildRepository.findByName(name);
    }

    async getGuildDetails(id) {
        const guild = await GuildRepository.findById(id);
        const members = await GuildMemberRepository.findByGuildId(id);
        const relations = await GuildRelationsRepository.findByGuildId(id);

        return {
            guild,
            members,
            relations
        }
    }
}

module.exports = new GuildService();