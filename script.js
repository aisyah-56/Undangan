/* =========================================================
   LAYAR PEMBUKA — dibuat paling atas supaya tombol selalu bisa dipakai
========================================================= */

(function () {
    const cover = document.getElementById("openingCover");
    if (cover) document.body.classList.add("locked");
})();

function openInvitation() {

    const cover = document.getElementById("openingCover");

    document.body.classList.remove("locked");

    if (cover) {
        cover.classList.add("hide");
        setTimeout(function () {
            cover.style.display = "none";
        }, 1000);
    }

    window.scrollTo(0, 0);

    /* klik tombol ini = interaksi pertama, jadi musik boleh mulai */
    try {
        if (typeof startMusic === "function") startMusic();
    } catch (e) {}

}


/* =========================================================
   WEDDING INVITATION JAVASCRIPT
========================================================= */


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


/* =========================================================
   MUSIC
========================================================= */

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");

let musicPlaying = false;

/*
   Browser biasanya melarang autoplay audio.
   Karena itu musik dimulai setelah user
   melakukan klik pertama.
*/

function startMusic() {

    if (!musicPlaying) {

        music.play()
            .then(() => {
                musicPlaying = true;
                musicButton.classList.add("playing");
                musicIcon.textContent = "♫";
            })
            .catch(() => {
                console.log("Audio menunggu interaksi user.");
            });

    }

}

/* klik tombol musik */

musicButton.addEventListener("click", () => {

    if (musicPlaying) {

        music.pause();
        musicPlaying = false;
        musicButton.classList.remove("playing");
        musicIcon.textContent = "♪";

    } else {

        music.play()
            .then(() => {
                musicPlaying = true;
                musicButton.classList.add("playing");
                musicIcon.textContent = "♫";
            })
            .catch(() => {});

    }

});


/* =========================================================
   FIRST USER INTERACTION
========================================================= */

/* Coba mulai musik pada interaksi pertama apa pun
   (klik, sentuh, scroll, tombol keyboard). Kalau browser
   menolak, percobaan diulang di interaksi berikutnya. */
["click", "touchstart", "scroll", "keydown"].forEach((evt) => {
    document.addEventListener(evt, function tryPlay() {
        if (musicPlaying) {
            document.removeEventListener(evt, tryPlay);
            return;
        }
        startMusic();
    }, { passive: true });
});


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", function (event) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        }

    });

});


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.style.boxShadow = "0 20px 60px rgba(16,26,56,.18)";
        navbar.style.background = "rgba(255,250,252,.96)";

    } else {

        navbar.style.boxShadow = "0 18px 60px rgba(16,26,56,.13)";
        navbar.style.background =
            "linear-gradient(110deg, rgba(255,255,255,.95), rgba(255,246,250,.92))";

    }

});


/* =========================================================
   WISHES FORM
========================================================= */

const wishForm = document.getElementById("wishForm");
const wishSuccess = document.getElementById("wishSuccess");
const wishList = document.getElementById("wishList");

/* TEMPEL URL Google Apps Script (Web app) DI SINI.
   Contoh: "https://script.google.com/macros/s/AKfy.../exec" */
const WISH_API_URL = "https://script.google.com/macros/s/AKfycbygo7fmoErH18VUI7F8L_eck6BAXMoMHHvnb2XntikOtcf67Cb-YEOWDVc02rsf-idtiQ/exec";

function showWishes(items) {

    if (!wishList) return;

    wishList.innerHTML = "";

    items.forEach((item) => {

        const card = document.createElement("div");
        card.className = "wish-item";

        const name = document.createElement("strong");
        name.textContent = item.nama;      /* textContent = aman */

        const text = document.createElement("p");
        text.textContent = item.ucapan;

        card.appendChild(name);
        card.appendChild(text);
        wishList.appendChild(card);

    });

}

async function loadWishes() {

    if (!WISH_API_URL) return;

    try {
        const res = await fetch(WISH_API_URL);
        const data = await res.json();
        showWishes(Array.isArray(data) ? data : []);
    } catch (error) {
        console.log("Ucapan belum bisa dimuat.");
    }

}

loadWishes();

wishForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const message = document.getElementById("guestMessage").value.trim();

    if (!name || !message) {
        alert("Silakan isi nama dan ucapan terlebih dahulu.");
        return;
    }

    if (!WISH_API_URL) {
        alert("Ucapan belum bisa dikirim saat ini. Silakan coba lagi nanti.");
        return;
    }

    const button = wishForm.querySelector("button[type=submit]");
    button.disabled = true;

    try {

        await fetch(WISH_API_URL, {
            method: "POST",
            mode: "no-cors",
            body: new URLSearchParams({ name, message })
        });

        /* pesan sukses: nama tamu + dua baris (aman, tanpa innerHTML) */
        wishSuccess.textContent = "";
        wishSuccess.appendChild(
            document.createTextNode("Terima kasih, " + name + " ♡")
        );
        wishSuccess.appendChild(document.createElement("br"));
        wishSuccess.appendChild(
            document.createTextNode(
                "Ucapan Anda sudah kami terima dan akan tampil setelah disetujui."
            )
        );
        wishSuccess.style.display = "block";

        document.getElementById("guestMessage").value = "";

        wishSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (error) {

        alert("Ucapan gagal terkirim. Periksa koneksi internet lalu coba lagi.");

    }

    button.disabled = false;

});


/* =========================================================
   CLOSING VIDEO
========================================================= */

const closingVideo = document.getElementById("closingVideo");

if (closingVideo) {

    /*
       Video closing dibuat muted supaya
       browser mengizinkan autoplay.
    */

    closingVideo.muted = true;

    const closingObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    closingVideo.play().catch(() => {});
                } else {
                    closingVideo.pause();
                }
            });
        },
        { threshold: 0.35 }
    );

    closingObserver.observe(closingVideo);

}


/* =========================================================
   PARALLAX DECORATION
========================================================= */

const decorations = document.querySelectorAll(".floating-decoration");

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;

    decorations.forEach((element, index) => {

        const speed = 0.03 + index * 0.008;

        element.style.transform = `translateY(${scroll * speed}px)`;

    });

});


/* =========================================================
   STORY CARD MOUSE EFFECT
========================================================= */

const storyCards = document.querySelectorAll(".story-card");

storyCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 45;
        const rotateY = (centerX - x) / 45;

        card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });

});


/* =========================================================
   SAVE THE DATE COUNTDOWN
========================================================= */

(function () {

    const target = new Date("2026-11-21T08:00:00+07:00").getTime();

    const elDays    = document.getElementById("sdDays");
    const elHours   = document.getElementById("sdHours");
    const elMinutes = document.getElementById("sdMinutes");
    const elSeconds = document.getElementById("sdSeconds");
    const elDone    = document.getElementById("sdDone");

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    function tick() {

        const diff = target - Date.now();

        if (diff <= 0) {

            elDays.textContent = "00";
            elHours.textContent = "00";
            elMinutes.textContent = "00";
            elSeconds.textContent = "00";

            if (elDone) {
                elDone.textContent = "Hari bahagia telah tiba ♡";
            }

            return false;
        }

        elDays.textContent    = pad(Math.floor(diff / 86400000));
        elHours.textContent   = pad(Math.floor(diff / 3600000) % 24);
        elMinutes.textContent = pad(Math.floor(diff / 60000) % 60);
        elSeconds.textContent = pad(Math.floor(diff / 1000) % 60);

        return true;
    }

    if (tick()) {

        const timer = setInterval(function () {
            if (!tick()) clearInterval(timer);
        }, 1000);

    }

})();


/* =========================================================
   COPY NOMOR REKENING
========================================================= */

document.querySelectorAll(".copy-btn").forEach((button) => {

    button.addEventListener("click", async () => {

        const target = document.getElementById(button.dataset.copy);

        if (!target) return;

        const text = target.textContent.trim();

        try {

            await navigator.clipboard.writeText(text);

        } catch (error) {

            /* fallback untuk browser lama */

            const temp = document.createElement("textarea");

            temp.value = text;

            document.body.appendChild(temp);

            temp.select();

            document.execCommand("copy");

            temp.remove();

        }

        const oldText = button.textContent;

        button.textContent = "✓ Nomor Tersalin";

        button.classList.add("copied");

        setTimeout(() => {

            button.textContent = oldText;

            button.classList.remove("copied");

        }, 2000);

    });

});


/* =========================================================
   KONFIRMASI GIFT VIA WHATSAPP
========================================================= */

const giftForm = document.getElementById("giftForm");

if (giftForm) {

    giftForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const sender = document.getElementById("giftSender").value.trim();
        const to = document.getElementById("giftTo").value;
        const amount = document.getElementById("giftAmount").value.trim();

        if (!sender || !to) {
            alert("Mohon isi nama pengirim dan rekening tujuan.");
            return;
        }

        /* GANTI dengan nomor WhatsApp pengantin (format 62, tanpa + atau 0) */

        const waNumber = "6281234567890";

        let text =
            `Halo Zahara & Adithya, saya *${sender}* sudah mengirim hadiah ke rekening *${to}*.`;

        if (amount) {
            text += ` Nominal: ${amount}.`;
        }

        text += " Selamat menempuh hidup baru ♡";

        window.open(
            `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
            "_blank"
        );

        giftForm.reset();

    });

}


/* =========================================================
   CONSOLE
========================================================= */

console.log("♡ Wedding Invitation — Zahara & Adithya ♡");


/* =========================================================
   KELOPAK BUNGA JATUH
========================================================= */

(function () {

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.createElement("div");
    layer.className = "petals";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const total = window.innerWidth < 600 ? 9 : 16;

    for (let i = 0; i < total; i++) {

        const petal = document.createElement("span");

        petal.className = "petal" + (i % 4 === 0 ? " gold" : "");

        petal.style.left = Math.random() * 100 + "%";
        petal.style.setProperty("--petal-size", (8 + Math.random() * 10) + "px");
        petal.style.setProperty("--petal-duration", (12 + Math.random() * 12) + "s");
        petal.style.setProperty("--petal-delay", (-Math.random() * 24) + "s");
        petal.style.setProperty("--drift", (30 + Math.random() * 70) + "px");
        petal.style.setProperty("--petal-opacity", (0.35 + Math.random() * 0.35).toFixed(2));

        layer.appendChild(petal);

    }

})();

/* =========================================================
   NAMA TAMU DARI LINK  (contoh: index.html?to=Nur+Zahra)
========================================================= */

(function () {

    const params = new URLSearchParams(window.location.search);
    const raw = (params.get("to") || "").trim();

    if (!raw) return;

    /* textContent = aman dari injeksi HTML */
    const title = document.getElementById("guestTitle");
    if (title) title.textContent = raw;

    const coverGuest = document.getElementById("coverGuest");
    if (coverGuest) coverGuest.textContent = raw;

    const input = document.getElementById("guestName");
    if (input) input.value = raw;

})();
