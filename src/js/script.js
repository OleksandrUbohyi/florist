const swiper = new Swiper(".swiper-container", {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },

    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
    },
});

const headerHamburger = document.querySelector(".header__hamburger");
headerHamburger.addEventListener("click", () => {
    document.getElementById("myNav").style.height = "100%";
});

const overlayClose = document.querySelector(".overlay__close");
overlayClose.addEventListener("click", () => {
    document.getElementById("myNav").style.height = "0%";
});

(function setFullheight() {
    let vh = window.innerHeight * 0.01;
    document.querySelector(".header").style.setProperty("--vh", `${vh}px`);
})();

window.addEventListener("resize", setFullheight);
