export function createModeController(root = document) {
    const buttons = [...root.querySelectorAll(".mode-btn")];
    const singleView = root.querySelector(".single-view");
    const multipleView = root.querySelector(".multiple-view");

    function showSingleView() {
        buttons.forEach((button) => button.classList.remove("active"));

        root.querySelector(".mode-btn.single")?.classList.add("active");

        singleView?.classList.add("active-view");
        multipleView?.classList.remove("active-view");
    }

    function showMultipleView() {
        buttons.forEach((button) => button.classList.remove("active"));

        root.querySelector(".mode-btn.multiple")?.classList.add("active");

        multipleView?.classList.add("active-view");
        singleView?.classList.remove("active-view");
    }

    function isMultipleViewActive() {
        return multipleView?.classList.contains("active-view") ?? false;
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
        if (button.classList.contains("single")) {
            showSingleView();
        } else {
            showMultipleView();
        }
        });
    });

    return {
        showSingleView,
        showMultipleView,
        isMultipleViewActive,
    };
}