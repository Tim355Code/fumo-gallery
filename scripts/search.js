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

        const isMultipleView = multipleView.classList.contains('active-view');

        if (isMultipleView) {
            const target = document.querySelector(`#all-artworks .frame[data-index="${index}"]`);

            if (!target) return;

            document
                .querySelectorAll('#all-artworks .frame')
                .forEach(frame => frame.classList.remove('search-highlight'));

            target.classList.add('search-highlight');

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            return;
        }

        if (typeof window.goToSlide === 'function') {
            window.goToSlide(index);
        }
    });

    clearBtn.addEventListener('click', () => {
        clearSearch();
        input.focus();
    });
}

async function loadAllArtworks() {
    const artworks = (await loadAppData())
        .map((item, index) => ({ ...item, originalIndex: index }));

    artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById('all-artworks');
    container.innerHTML = '';

    artworks.forEach(item => {
        const frame = document.createElement('div');
        frame.className = 'panel frame';
        frame.dataset.index = item.originalIndex;

        const name = item.latest || item.name;

        frame.innerHTML = `
            <img src="${item.image}" alt="${name}">
            <p class="name">${name}</p>
            <p class="date">${formatDate(item.date)}</p>
        `;

        container.appendChild(frame);
    });
}

setupSearch();
loadAllArtworks();

const buttons = document.querySelectorAll('.mode-btn');

const singleView = document.querySelector('.single-view');
const multipleView = document.querySelector('.multiple-view');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        if (button.classList.contains('single')) {
            singleView.classList.add('active-view');
            multipleView.classList.remove('active-view');
        } 
        else {
            multipleView.classList.add('active-view');
            singleView.classList.remove('active-view');
        }
    });
});
