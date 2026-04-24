export function createSearchController({
    root = document,
    data,
    onResultSelect,
}) {
    const wrapper = root.querySelector(".search");

    if (!wrapper) {
        return null;
    }

    const input = wrapper.querySelector(".search-input");
    const clearButton = wrapper.querySelector(".search-clear");
    const results = wrapper.querySelector(".search-results");

    function clearSearch() {
        input.value = "";
        results.innerHTML = "";
        wrapper.classList.remove("has-text", "show-results");
    }

    function normalizeSearchText(value) {
        return value.replace(/[^a-zA-Z0-9 ]/g, "");
    }

    function getMatches(query) {
        return data
            .map((item, index) => ({
                ...item,
                originalIndex: index,
            }))
            .filter((item) => {
                const character = item.character?.toLowerCase() || "";
                const name = item.name?.toLowerCase() || "";

                return character.includes(query) || name.includes(query);
            })
            .slice(0, 8);
    }

    function renderResults(matches) {
        if (!matches.length) {
            results.innerHTML = `<div class="search-empty">No results</div>`;
            return;
        }

        results.innerHTML = matches
            .map(
                (item) => `
                    <button
                        class="search-result"
                        type="button"
                        data-index="${item.originalIndex}"
                    >
                        ${item.character}
                    </button>
                `
            )
            .join("");
    }

    input.addEventListener("input", () => {
        input.value = normalizeSearchText(input.value);

        const query = input.value.trim().toLowerCase();
        const hasText = query.length > 0;

        wrapper.classList.toggle("has-text", hasText);

        if (!hasText) {
            wrapper.classList.remove("show-results");
            results.innerHTML = "";
            return;
        }

        const matches = getMatches(query);

        renderResults(matches);
        wrapper.classList.add("show-results");
    });

    results.addEventListener("click", (event) => {
        const button = event.target.closest(".search-result");
        if (!button) return;

        const index = Number(button.dataset.index);

        clearSearch();
        input.blur();

        onResultSelect?.(index);
    });

    clearButton?.addEventListener("click", () => {
        clearSearch();
        input.focus();
    });

    return {
        clearSearch,
    };
}
