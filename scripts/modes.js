export function createModeController(root = document) {
    const buttons = [...root.querySelectorAll(".mode-button")];
    const singleView = root.querySelector(".single-view");
    const multipleView = root.querySelector(".multiple-view");

    function setActiveButton(activeButton) {
        buttons.forEach((button) => {
            button.classList.toggle("is-active", button === activeButton);
        });
    }

    function showSingleView() {
        const button = root.querySelector(".mode-button.single");

        setActiveButton(button);

        singleView?.classList.add("is-active");
        multipleView?.classList.remove("is-active");
    }

    function showMultipleView() {
        const button = root.querySelector(".mode-button.multiple");

        setActiveButton(button);

        multipleView?.classList.add("is-active");
        singleView?.classList.remove("is-active");
    }

    function isMultipleViewActive() {
        return multipleView?.classList.contains("is-active") ?? false;
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
