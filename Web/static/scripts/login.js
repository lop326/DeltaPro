const btnStartLogin = document.getElementById('btnStartLogin');
const btnUnise = document.getElementById('btnUnirse');
const loginWrapper = document.getElementById('loginWrapper');
const titleApp = document.getElementById('titleApp');
const closeIcon = document.querySelector('.icon-close');

btnStartLogin.addEventListener('click', () => {
    loginWrapper.classList.add('show');
    titleApp.classList.add('up');
    btnStartLogin.classList.add('hide');
    btnUnise.classList.add('hide');
});

closeIcon.addEventListener('click', () => {
    loginWrapper.classList.remove('show');
    titleApp.classList.remove('up');
    btnStartLogin.classList.remove('hide');
    btnUnise.classList.remove('hide');
});
