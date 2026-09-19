document.addEventListener("DOMContentLoaded", () => {

    const navigation =
        document.querySelector(".nav-menu-mobile");

    if (!navigation) {
        return;
    }


    let lastScrollPosition =
        window.scrollY;


    window.addEventListener("scroll", () => {

        const currentScrollPosition =
            window.scrollY;


        /*
         * Самый верх страницы
         */

        if (currentScrollPosition <= 10) {

            navigation.classList.remove(
                "nav-m-hidden"
            );

            lastScrollPosition =
                currentScrollPosition;

            return;
        }


        /*
         * Скролл вниз
         */

        if (
            currentScrollPosition >
            lastScrollPosition
        ) {

            navigation.classList.add(
                "nav-m-hidden"
            );
        }


        /*
         * Скролл вверх
         */

        else if (
            currentScrollPosition <
            lastScrollPosition
        ) {

            navigation.classList.remove(
                "nav-m-hidden"
            );
        }


        lastScrollPosition =
            currentScrollPosition;

    });

});