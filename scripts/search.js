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

    function getSearchParts(item) {
        return [
            item.character || "",
            item.name || "",
        ]
            .join(" ")
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
    }

    function getSearchScore(item, query) {
        const character = item.character?.toLowerCase() || "";
        const name = item.name?.toLowerCase() || "";
        const parts = getSearchParts(item);

        if (character.startsWith(query)) return 0;
        if (name.startsWith(query)) return 1;

        if (parts.some((part) => part.startsWith(query))) return 2;

        if (character.includes(query)) return 3;
        if (name.includes(query)) return 4;

        return Infinity;
    }

    function getMatches(query) {
        return data
            .map((item, index) => ({
                ...item,
                originalIndex: index,
                searchScore: getSearchScore(item, query),
            }))
            .filter((item) => item.searchScore !== Infinity)
            .sort((a, b) => {
                if (a.searchScore !== b.searchScore) {
                    return a.searchScore - b.searchScore;
                }

                return a.character.localeCompare(b.character);
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

    input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        if (!wrapper.classList.contains("show-results")) return;

        const firstResult = results.querySelector(".search-result");
        if (!firstResult) return;

        event.preventDefault();
        firstResult.click();
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
