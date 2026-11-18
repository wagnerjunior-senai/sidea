
/* ==========================
   MENU RESPONSIVO
========================== */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {

    menuToggle.addEventListener("click", function () {

        nav.classList.toggle("show");

        const menuAberto = nav.classList.contains("show");

        menuToggle.textContent = menuAberto ? "✕" : "☰";

        menuToggle.setAttribute(
            "aria-expanded",
            menuAberto ? "true" : "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            menuAberto ? "Fechar menu" : "Abrir menu"
        );

    });

    nav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            nav.classList.remove("show");

            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");

        });

    });

}

/* ==========================
   FILTROS DA GALERIA
========================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const categoria = button.dataset.filter;

        galleryItems.forEach(function (item) {

            if (
                categoria === "all" ||
                item.dataset.category === categoria
            ) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }

        });

    });

});

/* ==========================
   FORMULÁRIO DEMONSTRATIVO
========================== */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm && formMessage) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const nome = document
            .getElementById("contactName")
            .value.trim();

        const email = document
            .getElementById("contactEmail")
            .value.trim();

        const assunto = document
            .getElementById("contactSubject")
            .value;

        const mensagem = document
            .getElementById("contactMessage")
            .value.trim();

        if (
            nome === "" ||
            email === "" ||
            assunto === "" ||
            mensagem === ""
        ) {

            formMessage.textContent = "Preencha todos os campos.";

            return;

        }

        formMessage.textContent =
            "Mensagem preenchida com sucesso! Este formulário é demonstrativo.";

        contactForm.reset();

    });

}

/* ==========================
   ANO AUTOMÁTICO NO RODAPÉ
========================== */

document.querySelectorAll(".footer-info").forEach(function (footer) {

    const texto = footer.querySelector("p:nth-child(2)");

    if (texto) {

        texto.textContent =
            "© " + new Date().getFullYear() +
            " SIDE A. Todos os direitos reservados.";

    }

});
