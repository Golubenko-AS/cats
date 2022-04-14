const authForm = document.querySelector(".auth_container");
const inputName = authForm.querySelector(".auth-form__input");
authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputName.value.trim() !== "") {
        document.cookie = `user=${inputName.value}; secure; samesity=lax`;
        inputName.value = "";
        window.location.replace("index.html")
    } else {
        alert("Вы не авторизовались. Введите ваше имя.");
    }
})

if (document.cookie) {
    window.location.replace("index.html")
}
