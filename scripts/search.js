const wrapper = document.querySelector('.search-wrapper');
const input = wrapper.querySelector('.search-input');
const clearBtn = wrapper.querySelector('.clear-btn');
const results = wrapper.querySelector('.search-results');

function clearSearch() {
    input.value = '';
    results.innerHTML = '';
    wrapper.classList.remove('has-text', 'show-results');
}

function renderResults(matches) {
    results.innerHTML = matches.length
        ? matches.map((item, index) => `
            <button 
                class="search-result" 
                type="button"
                data-index="${item.originalIndex}"
            >
                ${item.character}
            </button>
        `).join('')
        : `<div class="no-results">No results</div>`;
}

function setupSearch() {
    input.addEventListener('input', () => {
        loadAppData().then(data => {
            input.value = input.value.replace(/[^a-zA-Z0-9 ]/g, '');

            const query = input.value.trim().toLowerCase();
            const hasText = query.length > 0;

            wrapper.classList.toggle('has-text', hasText);

            if (!hasText) {
                wrapper.classList.remove('show-results');
                results.innerHTML = '';
                return;
            }

            const matches = data
                .map((item, index) => ({ ...item, originalIndex: index }))
                .filter(item =>
                    item.character.toLowerCase().includes(query) ||
                    item.name.toLowerCase().includes(query)
                )
                .slice(0, 8);

            renderResults(matches);
            wrapper.classList.add('show-results');
        });
    });

    results.addEventListener('click', (event) => {
        const button = event.target.closest('.search-result');
        if (!button) return;

        const index = Number(button.dataset.index);

        clearSearch();
        input.blur();

        if (typeof window.goToSlide === 'function') {
            window.goToSlide(index);
        }
    });

    clearBtn.addEventListener('click', () => {
        clearSearch();
        input.focus();
    });
}

setupSearch();