document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const companyInput = document.getElementById("contact-company");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");
  const consentInput = document.getElementById("contact-consent");

  const submitButton = document.getElementById("contact-submit");
  const result = document.getElementById("form-result");

  const honeypot = document.getElementById("website");

  let isSubmitting = false;

  const LIMITS = {
    nameMin: 2,
    nameMax: 100,

    emailMax: 254,

    companyMin: 2,
    companyMax: 150,

    messageMin: 10,
    messageMax: 5000,
  };

  const allowedSubjects = ["job", "interview", "project", "freelance", "other"];

  // ================================
  // HELPERS
  // ================================

  function normalize(value) {
    return value
      .replace(/\u0000/g, "")
      .replace(/\r\n/g, "\n")
      .trim();
  }

  function containsHTML(value) {
    return /<[^>]*>/i.test(value);
  }

  function getErrorElement(input) {
    const errorIdMap = {
      "contact-name": "name-error",
      "contact-email": "email-error",
      "contact-company": "company-error",
      "contact-subject": "subject-error",
      "contact-message": "message-error",
    };

    return document.getElementById(errorIdMap[input.id]);
  }

  function setError(input, message) {
    const errorElement = getErrorElement(input);

    if (!errorElement) return;

    errorElement.textContent = message;
    errorElement.classList.add("visible");

    input.classList.add("invalid");
  }

  function clearError(input) {
    const errorElement = getErrorElement(input);

    if (!errorElement) return;

    errorElement.textContent = "";
    errorElement.classList.remove("visible");

    input.classList.remove("invalid");
  }

  function setConsentError(message) {
    const errorElement = document.getElementById("consent-error");
    const consentWrapper = document.querySelector(".form-consent");

    if (!errorElement) return;

    errorElement.textContent = message;
    errorElement.classList.add("visible");

    if (consentWrapper) {
      consentWrapper.classList.add("invalid");
    }
  }

  function clearConsentError() {
    const errorElement = document.getElementById("consent-error");
    const consentWrapper = document.querySelector(".form-consent");

    if (!errorElement) return;

    errorElement.textContent = "";
    errorElement.classList.remove("visible");

    if (consentWrapper) {
      consentWrapper.classList.remove("invalid");
    }
  }

  function showResult(message, type) {
    result.textContent = message;

    result.className = `form-result ${type} visible`;
  }

  function hideResult() {
    result.classList.remove("visible");
  }

  function resetErrors() {
    clearError(nameInput);
    clearError(emailInput);
    clearError(companyInput);
    clearError(subjectInput);
    clearError(messageInput);
    clearConsentError();
  }

  // ================================
  // VALIDATION
  // ================================

  function validateForm() {
    let isValid = true;

    resetErrors();

    const name = normalize(nameInput.value);
    const email = normalize(emailInput.value);
    const company = normalize(companyInput.value);
    const subject = normalize(subjectInput.value);
    const message = normalize(messageInput.value);

    // NAME
    if (!name) {
      setError(nameInput, "Введите имя.");
      isValid = false;
    } else if (name.length < LIMITS.nameMin) {
      setError(nameInput, "Имя слишком короткое.");
      isValid = false;
    } else if (name.length > LIMITS.nameMax) {
      setError(nameInput, "Имя слишком длинное.");
      isValid = false;
    } else if (containsHTML(name)) {
      setError(nameInput, "Недопустимые символы.");
      isValid = false;
    }

    // EMAIL
    if (!email) {
      setError(emailInput, "Введите email.");
      isValid = false;
    } else if (email.length > LIMITS.emailMax) {
      setError(emailInput, "Email слишком длинный.");
      isValid = false;
    } else if (containsHTML(email)) {
      setError(emailInput, "Недопустимые символы.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(emailInput, "Введите корректный email.");
      isValid = false;
    }

    // COMPANY
    if (company) {
      if (company.length < LIMITS.companyMin) {
        setError(companyInput, "Название слишком короткое.");
        isValid = false;
      } else if (company.length > LIMITS.companyMax) {
        setError(companyInput, "Название слишком длинное.");
        isValid = false;
      } else if (containsHTML(company)) {
        setError(companyInput, "Недопустимые символы.");
        isValid = false;
      }
    }

    // SUBJECT
    if (!subject) {
      setError(subjectInput, "Выберите тип связи.");
      isValid = false;
    } else if (!allowedSubjects.includes(subject)) {
      setError(subjectInput, "Некорректный тип связи.");
      isValid = false;
    }

    // MESSAGE
    if (!message) {
      setError(messageInput, "Введите сообщение.");
      isValid = false;
    } else if (message.length < LIMITS.messageMin) {
      setError(messageInput, `Минимум ${LIMITS.messageMin} символов.`);
      isValid = false;
    } else if (message.length > LIMITS.messageMax) {
      setError(messageInput, `Максимум ${LIMITS.messageMax} символов.`);
      isValid = false;
    } else if (containsHTML(message)) {
      setError(messageInput, "Недопустимые HTML-теги.");
      isValid = false;
    }

    // CONSENT
    if (!consentInput.checked) {
      setConsentError("Необходимо согласие на обработку персональных данных.");
      isValid = false;
    }

    // HONEYPOT
    if (honeypot && honeypot.value.trim() !== "") {
      isValid = false;
    }

    return isValid;
  }

  // ================================
  // SUBMIT
  // ================================

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    hideResult();

    if (!validateForm()) {
      showResult("// ПРОВЕРЬТЕ ДАННЫЕ В ФОРМЕ", "error");

      return;
    }

    isSubmitting = true;

    const submitText = submitButton.querySelector(".submit-text");

    if (submitText) {
      submitText.textContent = "TRANSMITTING...";
    }

    submitButton.disabled = true;
    submitButton.classList.add("loading");

    const formData = new FormData(form);

    // Нормализуем данные перед отправкой
    formData.set("name", normalize(nameInput.value));

    formData.set("email", normalize(emailInput.value));

    formData.set("company", normalize(companyInput.value));

    formData.set("message", normalize(messageInput.value));

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // УСПЕШНАЯ ОТПРАВКА

        form.reset();

        resetErrors();

        showResult("// СООБЩЕНИЕ УСПЕШНО ОТПРАВЛЕНО", "success");

        // Убираем уведомление через 5 секунд
        setTimeout(() => {
          hideResult();
        }, 5000);
      } else {
        // ОШИБКА FORMSPREE

        let errorMessage = "Не удалось отправить сообщение.";

        if (data.errors && data.errors.length > 0) {
          errorMessage = data.errors.map((error) => error.message).join(" ");
        }

        showResult(`// ERROR: ${errorMessage}`, "error");
      }
    } catch (error) {
      showResult("// CONNECTION ERROR — TRY AGAIN", "error");
    } finally {
      isSubmitting = false;

      submitButton.disabled = false;
      submitButton.classList.remove("loading");

      if (submitText) {
        submitText.textContent = "SEND MESSAGE";
      }
    }
  });

  // ================================
  // CLEAR ERRORS WHILE TYPING
  // ================================

  nameInput.addEventListener("input", () => {
    clearError(nameInput);
    hideResult();
  });

  emailInput.addEventListener("input", () => {
    clearError(emailInput);
    hideResult();
  });

  companyInput.addEventListener("input", () => {
    clearError(companyInput);
    hideResult();
  });

  subjectInput.addEventListener("change", () => {
    clearError(subjectInput);
    hideResult();
  });

  messageInput.addEventListener("input", () => {
    clearError(messageInput);
    hideResult();
  });

  consentInput.addEventListener("change", () => {
    clearConsentError();
    hideResult();
  });
});
