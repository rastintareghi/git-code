let wheel = document.querySelector("#wheel");
let button = document.querySelector("#spin");
let fileInput = document.querySelector("#file-input");
let formLabel = document.querySelector(".form__label");
let modalWrapper = document.querySelector(".modal-wrapper");
let modalBtn = document.querySelector(".modal-btn");
let orderNumberTd = document.querySelector(".orderNumberTd");
let fullNameTd = document.querySelector(".fullNameTd");
let data = null;
let orderNumber = null;
let fullName = null;

fileInput.addEventListener("change", async () => {
  let allowedExtensions = ["csv", "xlsx"];
  let file = fileInput.files[0];
  if (file) {
    let fileExtension = file.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      formLabel.classList.add("hidden");
      button.classList.remove("hidden");
      try {
        let response = await uploadFile(file);
        if (response && Array.isArray(response.data)) {
          data = [...response.data];
          console.log("Data loaded:", data);
        } else {
          orderNumber = response.data["شماره سفارش"];
          fullName = response.data["نام (صورتحساب)"] + " " + response.data["نام خانوادگی (صورتحساب)"];
        }
      } catch (error) {
        console.error("Error during file upload:", error);
        showToast("در ارسال فایل خطایی رخ داد.", "error");
      }
    } else {
      showToast("فقط فایل‌های اکسل و CSV مجاز هستند.", "error");
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

function selectRandomData() {
  if (data && data.length > 0) {
    let randomIndex = Math.floor(Math.random() * data.length);
    orderNumber = data[randomIndex]["شماره سفارش"];
    fullName = data[randomIndex]["نام (صورتحساب)"] + " " + data[randomIndex]["نام خانوادگی (صورتحساب)"];
    data.splice(randomIndex, 1);
  }
  if (data && data.length === 0) {
    button.classList.add("hidden");
  }
}

button.addEventListener("click", spinWheel);

function spinWheel(evt) {
  if (data && data.length > 0) {
    button.disabled = true;
    button.style.cursor = "not-allowed";
    let spin = Math.round(Math.random() * 5220);
    wheel.style.setProperty("transition", "ease 2.5s");
    wheel.style.transform = 'rotate(' + spin + 'deg)';
    setTimeout(() => {
      if (orderNumber) {
        orderNumberTd.innerText = orderNumber;
        fullNameTd.innerText = fullName;
        modalWrapper.classList.remove("d-none");
      } else {
        modalWrapper.classList.add("d-none");
        console.log("شماره سفارش موجود نیست.");
      }
      button.classList.remove("hidden");
      button.disabled = false;
      button.style.cursor = "pointer";
    }, 2500);

    selectRandomData();
  } else {
    showToast("دیگر اسمی برای قرعه‌کشی باقی نمانده است", "error");
  }
}

modalBtn.addEventListener("click", () => {
  modalWrapper.classList.add("d-none");
  orderNumber = null;
  fullName = null;
});

function showToast(message, type) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: type === "error" ? "red" : "green",
    close: true
  }).showToast();
}

const userName='rastin'
const userNames='rastin'
const getMe=()=>{
  reeturn true
}
