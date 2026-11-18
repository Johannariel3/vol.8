(function () {
  var intro = document.getElementById("intro");
  var letter = document.getElementById("letter");
  var startButton = document.getElementById("start");
  var backButtons = document.querySelectorAll("[data-back]");

  var yesButton = document.getElementById("btn-yes");
  var noButton = document.getElementById("btn-no");
  var reply = document.getElementById("reply");
  var replyText = document.getElementById("reply-text");

  var music = document.getElementById("musik");
  var soundButton = document.getElementById("sound");

  // Tulisan yang muncul setelah salah satu pilihan diketuk.
  var MESSAGES = {
    yes: "sayang, thank you very much cause you still love me. keep my promise, i'll never doing something makes this situation like a shit and i'll show you more more more love than before.",
    no1: "sayang serius? :(((",
    no2: "aku bener bener minta maaf karna gagal jadi pasangan kamu dan malah nyakitin kamu. aku ngerti sama resiko yang harus aku terima. If you're not love me anymore, i'd still love you, sayang."
  };

  var noTaps = 0;

  function showReply(text) {
    replyText.textContent = text;
    // mulai ulang animasi supaya terasa ada pesan baru
    reply.hidden = true;
    void reply.offsetWidth;
    reply.hidden = false;

    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reply.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "nearest" });
  }

  function resetChoices() {
    noTaps = 0;
    reply.hidden = true;
    replyText.textContent = "";
    yesButton.setAttribute("aria-pressed", "false");
    noButton.setAttribute("aria-pressed", "false");
  }

  // ---------- Musik ----------
  function playMusic() {
    music.volume = 0.6;
    var attempt = music.play();
    // Browser bisa menolak pemutaran; kalau begitu, tombol musik tetap bisa dipakai.
    if (attempt && attempt.catch) { attempt.catch(function () {}); }
  }

  function stopMusic() {
    music.pause();
    music.currentTime = 0;
  }

  music.addEventListener("play", function () { soundButton.setAttribute("aria-pressed", "true"); });
  music.addEventListener("pause", function () { soundButton.setAttribute("aria-pressed", "false"); });

  // Kalau file musik tidak ditemukan, sembunyikan tombol musik.
  music.addEventListener("error", function () { soundButton.hidden = true; });

  soundButton.addEventListener("click", function () {
    if (music.paused) { playMusic(); } else { music.pause(); }
  });

  // ---------- Halaman ----------
  // Halaman 1 -> halaman surat (musik mulai di sini, karena ini ketukan dari pengguna)
  startButton.addEventListener("click", function () {
    intro.hidden = true;
    letter.hidden = false;
    window.scrollTo(0, 0);
    playMusic();
  });

  // "ofc i still love you"
  yesButton.addEventListener("click", function () {
    noTaps = 0;
    yesButton.setAttribute("aria-pressed", "true");
    noButton.setAttribute("aria-pressed", "false");
    showReply(MESSAGES.yes);
  });

  // "nevermore": ketukan pertama dan kedua punya pesan berbeda
  noButton.addEventListener("click", function () {
    noTaps += 1;
    noButton.setAttribute("aria-pressed", "true");
    yesButton.setAttribute("aria-pressed", "false");
    showReply(noTaps === 1 ? MESSAGES.no1 : MESSAGES.no2);
  });

  // Tombol kembali -> halaman pertama (musik berhenti dan mulai dari awal lagi nanti)
  for (var i = 0; i < backButtons.length; i++) {
    backButtons[i].addEventListener("click", function () {
      resetChoices();
      stopMusic();
      letter.hidden = true;
      intro.hidden = false;
      window.scrollTo(0, 0);
    });
  }

  // Kalau file foto belum ada, tampilkan kotak kosong yang rapi.
  var photos = document.querySelectorAll(".photo");
  Array.prototype.forEach.call(photos, function (figure) {
    var img = figure.querySelector("img");
    function markEmpty() { figure.classList.add("kosong"); }
    img.addEventListener("error", markEmpty);
    if (img.complete && img.naturalWidth === 0) { markEmpty(); }
  });
})();