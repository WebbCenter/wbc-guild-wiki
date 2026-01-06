class SearchResponseMapper {
    mapToResponse(searchResults) {
        let results = [];
        searchResults.forEach((result) => {
            const isGuildSearch = result.name != null ? true : false;

            results.push({
                "name": isGuildSearch ? result.name : result.player_name,
                "route": `/${isGuildSearch ? 'guild' : 'player'}/${result.id}`,
                "aliases": null,
                "image": isGuildSearch ? `/api/guild-banner/${result.id}` : `/api/player-skin/${result.id}`
            });
        });

        return results;
    }
}

module.exports = new SearchResponseMapper();