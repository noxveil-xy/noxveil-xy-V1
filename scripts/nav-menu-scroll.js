document.addEventListener("DOMContentLoaded", () => {
    const navigation = document.querySelector(".nav-menu");
    
    let lastScrollPosition = window.scrollY;
    
    window.addEventListener("scroll", () => {
    
        const currentScrollPosition = window.scrollY;
    
        /*
         * Находимся в самом верху страницы
         * → меню всегда показываем
         */
    
        if (currentScrollPosition <= 10) {
    
            navigation.classList.remove("nav-hidden");
    
            lastScrollPosition = currentScrollPosition;
    
            return;
        }
    
    
        /*
         * Пользователь листает вниз
         */
    
        if (currentScrollPosition > lastScrollPosition) {
    
            navigation.classList.add("nav-hidden");
    
        }
    
    
        /*
         * Пользователь листает вверх
         */
    
        else if (currentScrollPosition < lastScrollPosition) {
    
            navigation.classList.remove("nav-hidden");
    
        }
    
    
        lastScrollPosition = currentScrollPosition;
    });
}
)
