const pages = [
    {
        "name": "Guilda",
        "route": "/guilds",
        "aliases": [
            "guildas", "clã", "clãs"
        ],
        "image": "/images/guild-banner.png"
    },
    {
        "name": "Guilding",
        "route": "/teste",
        "aliases": [
            "teste"
        ]
    }
];

const searchBar = document.getElementById('search-bar');
const queryResults = document.getElementById('query-results')

let debounceTimer;

searchBar.addEventListener('keyup', async (event) => {
    clearTimeout(debounceTimer);

    const query = event.target.value.toLowerCase();
    if (query.length < 3) {
        queryResults.style.display = 'none';
        return;
    }

    debounceTimer = setTimeout(async () => {
        queryResults.innerHTML = "";
        let results = null;

        const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedQuery = normalizeString(query);
        results = Array.from(pages.filter(page =>
            normalizeString(page.name.toLowerCase()).startsWith(normalizedQuery) ||
            page.aliases.some(alias => normalizeString(alias).startsWith(normalizedQuery))
        ));

        const response = await fetch('/api/search?q=' + encodeURIComponent(query));
        const data = await response.json();
        results = results.concat(data);

        if (results.length > 0) {
            results.forEach((result) => {
                let a = document.createElement('a');
                a.classList.add('result');
                a.setAttribute('href', result.route);

                if (result.image != null) {
                    let img = document.createElement('img');
                    img.classList.add('result-img');
                    img.src = result.image;

                    a.appendChild(img);
                }
                else {
                    let i = document.createElement('i');
                    i.classList.add('result-img', 'fas', 'fa-image');

                    a.appendChild(i);
                }

                let text = document.createTextNode(result.name);
                a.appendChild(text);

                queryResults.appendChild(a)
            })

            queryResults.style.display = 'flex';
        }
        else
            queryResults.style.display = 'none';
    }, 250);
});

searchBar.addEventListener('blur', () => {
    setTimeout(() => {
        queryResults.style.display = 'none';
    }, 100);
});