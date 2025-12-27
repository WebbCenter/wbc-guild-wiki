function table(element, columns, rows) {
    const table = document.createElement('table');

    // Cabeçalho
    const thead = document.createElement('thead');
    let tr = document.createElement('tr');

    columns.forEach((column) => {
        let th = document.createElement('th');
        th.textContent = column.name;
        th.style.width = `${column.width}%`;
        th.setAttribute('tabindex', '0');

        if (column.sorting === true)
            th.classList.add('headerSort');

        tr.append(th);
    })

    thead.appendChild(tr);

    // Corpo
    const tbody = document.createElement('tbody');

    rows.forEach((row) => {
        tr = document.createElement('tr');
        
        row.forEach((cellContent) => {
            let td = document.createElement('td');
            td.innerHTML = cellContent;
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    element.appendChild(table);

    const headers = table.querySelectorAll('th.headerSort');
    const originalRows = Array.from(tbody.querySelectorAll('tr'));
    
    headers.forEach((header) => {
        header.addEventListener('click', () => {
            const columnIndex = Array.from(header.parentNode.children).indexOf(header);
            sortTable(columnIndex, header);
        });
        header.style.cursor = 'pointer';
    });
    
    function sortTable(columnIndex, header) {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const currentState = header.dataset.sortState || 'none';
        
        headers.forEach(h => {
            h.classList.remove('asc', 'desc');
            if (h !== header)
                h.dataset.sortState = 'none';
        });
        
        let newState;
        let sortedRows;
        
        if (currentState === 'none') {
            newState = 'asc';
            header.classList.add('asc');
            sortedRows = rows.sort((a, b) => {
                const aValue = a.cells[columnIndex].textContent.trim();
                const bValue = b.cells[columnIndex].textContent.trim();
                return bValue.localeCompare(aValue, 'pt-BR');
            });
        } else if (currentState === 'asc') {
            newState = 'desc';
            header.classList.add('desc');
            sortedRows = rows.sort((a, b) => {
                const aValue = a.cells[columnIndex].textContent.trim();
                const bValue = b.cells[columnIndex].textContent.trim();
                return aValue.localeCompare(bValue, 'pt-BR');
            });
        } else {
            newState = 'none';
            sortedRows = originalRows.slice();
        }
        
        header.dataset.sortState = newState;

        sortedRows.forEach(row => tbody.appendChild(row));
    }
}

function getTranslatedMemberRole(role) {
    switch (role) {
        case 'LEADER':
            return 'Líder';
        case 'OFFICER':
            return 'Oficial';
        default:
            return 'Membro';
    }
}

function getTranslatedGuildRelationStatus(status) {
    switch (status) {
        case 'PENDING':
            return 'Pendente';
        case 'ACTIVE':
            return 'Ativa';
        case 'EXPIRED':
            return 'Expirada';
        default:
            return 'Cancelada';
    }
}

function getTranslatedGuildRelationType(type) {
    switch (type) {
        case 'ALLY':
            return 'Aliado';
        case 'ENEMY':
            return 'Inimigo';
        case 'WAR':
            return 'Guerra';
        case 'TRUCE':
            return 'Trégua';
        default:
            return 'Neutro';
    }
}

function setPageMetaTags() {
    let descriptionMetaTags = [
        document.getElementById('description'),
        document.getElementById('og:description'),
        document.getElementById('twitter:description')
    ];

    let descriptionText = document.getElementById('main-description').textContent.trim().replace(/\s+/g, ' ');

    descriptionMetaTags.forEach((metaTag) => {
        if (metaTag)
            metaTag.setAttribute('content', descriptionText);
    })
}

function setSummary() {
    let summary = document.getElementById('summary');
    let subtitles = Array.from(document.getElementsByClassName('subtitle'));

    subtitles.forEach((subtitle) => {
        let a = document.createElement('a');
        a.classList.add('summary-topic');
        a.textContent = subtitle.textContent;
        a.href = `#${a.textContent.trim().replace(/\s+/g, ' ').toLocaleLowerCase()}`

        summary.appendChild(a);
    })
}