document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".glitch-title");

  if (!title) return;

  const lines = title.querySelectorAll(".glitch-line");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@!?<>/\\[]{}";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  async function glitchLine(line) {
    const originalHTML = line.innerHTML;
    const textNodes = [];

    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);

    let node;

    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    /* Сохраняем оригинальный текст */

    const originalTexts = textNodes.map((node) => node.textContent);

    /*
     * Фаза 1
     * Небольшое мерцание
     */

    line.classList.add("glitch-active");

    await sleep(40);

    line.classList.remove("glitch-active");

    /*
     * Фаза 2
     * Разваливаем символы
     */

    for (let i = 0; i < 3; i++) {
      textNodes.forEach((node, index) => {
        const original = originalTexts[index];

        node.textContent = [...original]
          .map((char) => {
            if (char === " ") return " ";

            return Math.random() > 0.45 ? randomChar() : char;
          })
          .join("");
      });

      await sleep(55);
    }

    /*
     * Фаза 3
     * Почти полная цифровая помеха
     */

    textNodes.forEach((node, index) => {
      const original = originalTexts[index];

      node.textContent = [...original]
        .map((char) => {
          if (char === " ") return " ";

          return Math.random() > 0.15 ? randomChar() : char;
        })
        .join("");
    });

    await sleep(65);

    /*
     * Фаза 4
     * Возвращаем оригинальные символы
     * постепенно
     */

    for (let step = 0; step <= 5; step++) {
      textNodes.forEach((node, index) => {
        const original = originalTexts[index];

        node.textContent = [...original]
          .map((char, charIndex) => {
            if (char === " ") return " ";

            const progress = charIndex / original.length;

            return progress < step / 5 ? char : randomChar();
          })
          .join("");
      });

      await sleep(45);
    }

    /*
     * Финальное восстановление
     */

    textNodes.forEach((node, index) => {
      node.textContent = originalTexts[index];
    });

    line.innerHTML = originalHTML;

    line.classList.remove("glitch-active");
  }

  async function runGlitch() {
    /*
     * Небольшая случайная задержка
     * между циклами
     */

    await sleep(3000 + Math.random() * 2500);

    /*
     * Обе строки могут немного
     * отличаться по времени
     */

    await glitchLine(lines[0]);

    await sleep(80);

    await glitchLine(lines[1]);

    runGlitch();
  }

  runGlitch();
});
