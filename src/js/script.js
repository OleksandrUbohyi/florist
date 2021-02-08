const swiper = new Swiper(".swiper-container", {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    speed: 1000,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },

    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
    },

    breakpoints: {
        // when window width is >= 768px
        768: {
            slidesPerView: 2,
            spaceBetween: 28,
            slidesPerGroup: 2,
        },
    },
});

const headerHamburger = document.querySelector(".header__hamburger");
headerHamburger.addEventListener("click", () => {
    document.getElementById("myNav").style.height = "100%";
    document.body.style.overflowY = "hidden";
});

const overlayClose = document.querySelector(".overlay__close");
overlayClose.addEventListener("click", () => {
    document.getElementById("myNav").style.height = "0%";
    document.body.style.overflowY = "";
});
