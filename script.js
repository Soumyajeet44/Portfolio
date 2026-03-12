// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       Smooth Scroll
    ========================== */
    const links = document.querySelectorAll("a[href^='#']");

links.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {

            const navHeight = document.querySelector(".nav").offsetHeight;

            const sectionTop =
                targetSection.getBoundingClientRect().top +
                window.pageYOffset -
                navHeight;

            window.scrollTo({
                top: sectionTop,
                behavior: "smooth"
            });
        }
    });
});


    /* =========================
       Navbar Background Change
    ========================== */
    const nav = document.querySelector(".nav");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            nav.style.background = "#111";
            nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
        } else {
            nav.style.background = "#0d0d0d";
            nav.style.boxShadow = "none";
        }
    });


    /* =========================
       Active Menu Highlight
    ========================== */
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".menu a");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    });


    /* =========================
       Contact Form Handling
    ========================== */
    const form = document.querySelector(".contact-form");

    form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        name: form.querySelector("input[type='text']").value,
        email: form.querySelector("input[type='email']").value,
        message: form.querySelector("textarea").value
    };

    const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Message Sent Successfully 🚀");
    form.reset();
});

});