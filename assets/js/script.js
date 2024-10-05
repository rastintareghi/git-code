let wheel = document.querySelector("#wheel");
let button = document.querySelector("#spin");
let fileInput = document.querySelector("#file-input");
let formLabel = document.querySelector(".form__label");
let modalWrapper = document.querySelector(".modal-wrapper");
let modalBtn = document.querySelector(".modal-btn");
let orderNumberSpan = document.querySelector(".orderNumberSpan");

// متغیری برای ذخیره شماره سفارش
let orderNumber = null;

fileInput.addEventListener("change", async () => {
  let allowedExtensions = ["csv", "xlsx"];
  let file = fileInput.files[0];
  if (file) {
    let fileExtension = file.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      button.classList.remove("hidden");
      formLabel.classList.add("hidden");
      try {
        let response = await uploadFile(file);

        // فرض بر این است که response.data یک آرایه از اشیاء است
        if (Array.isArray(response.data)) {
          let randomIndex = Math.floor(Math.random() * response.data.length);
          orderNumber = response.data[randomIndex]["شماره سفارش"];
        } else {
          orderNumber = response.data["شماره سفارش"]; // اگر تنها یک شیء باشد
        }

      } catch (error) {
        console.error("Error during file upload:", error);
        alert("در ارسال فایل خطایی رخ داد.");
      }
    } else {
      alert("فقط فایل‌های اکسل و CSV مجاز هستند.");
      fileInput.value = "";
    }
  }
});

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    let response = await fetch("https://ap.sbsuntech.ir/api", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`خطا در ارسال فایل: ${response.statusText}`);
    }

    let result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

button.addEventListener("click", spinWheel);

function spinWheel(evt) {
  let spin = Math.round(Math.random() * 5220);
  wheel.style.setProperty("transition", "ease 2.5s");
  wheel.style.transform = 'rotate(' + spin + 'deg)';

  setTimeout(() => {
    if (orderNumber) {
      orderNumberSpan.innerText = orderNumber;
      modalWrapper.classList.remove("d-none");
    } else {
      modalWrapper.classList.add("d-none");
      console.log("شماره سفارش موجود نیست.");
    }

  }, 2500);
}

modalBtn.addEventListener("click", () => {
  modalWrapper.classList.add("d-none");
  location.reload();
});
