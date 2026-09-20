const mobileMenuButton = document.querySelector(".mobile-menu-button");

const navigation = document.querySelector(".nav-menu");

const navigationLinks = document.querySelectorAll(".nav-menu_elements_li a");

/* ========================================
   OPEN / CLOSE MOBILE MENU
======================================== */

if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("mobile-open");

    mobileMenuButton.classList.toggle("active", isOpen);

    mobileMenuButton.setAttribute("aria-expanded", isOpen);
  });
}

/* ========================================
   CLOSE AFTER CLICK
======================================== */

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("mobile-open");

    mobileMenuButton.classList.remove("active");

    mobileMenuButton.setAttribute("aria-expanded", "false");
  });
});
