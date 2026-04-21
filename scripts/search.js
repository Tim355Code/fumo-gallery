const wrapper = document.querySelector('.search-wrapper');
const input = wrapper.querySelector('.search-input');
const clearBtn = wrapper.querySelector('.clear-btn');
const results = wrapper.querySelector('.search-results');

let items = [];

async function loadSearchItems()
{
    const response = await fetch(`artworks.json?v=${Date.now()}`);
    const data = await response.json();

    items = data.map(item => item.character);
}

function setupSearch()
{
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^a-zA-Z0-9 ]/g, '');

        const query = input.value.trim().toLowerCase();
        const hasText = query.length > 0;

        wrapper.classList.toggle('has-text', hasText);

        if (!hasText) {
            wrapper.classList.remove('show-results');
            results.innerHTML = '';
            return;
        }

        const matches = items.filter(item => item.toLowerCase().includes(query)).slice(0, 8);;

        results.innerHTML = matches.length
            ? matches.map(item => `<button class="search-result" type="button">${item}</button>`).join('')
            : `<div class="no-results">No results</div>`;

        wrapper.classList.add('show-results');
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        wrapper.classList.remove('has-text', 'show-results');
        input.focus();
    });
}

async function initSearch() {
    await loadSearchItems();
    setupSearch();
}

initSearch();
