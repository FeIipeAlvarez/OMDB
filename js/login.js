import { createLocalStorageUsers, createUser, userActiver, userExists, generateUserkey, currentUser } from './user.js';

const d = document;
const $form = d.getElementById("formSignIn");
const $username = d.getElementById("username");
const $password = d.getElementById("password");


//Cada que se carge el login, se eliminará el item, esto para validar que no se acceda sin suministrar usuario y contraseña.
d.addEventListener('DOMContentLoaded', () => {
    sessionStorage.removeItem('login');
    createLocalStorageUsers()
});

const validateLogin = () => {

    for (const input of d.querySelectorAll('.formGroup__input')) {
        const $messageError = input.previousElementSibling;
        if (!input.value.trim()) $messageError.textContent = 'This input is required.';

        else $messageError.textContent = '';

    }
    return $username.value.trim() !== '' && $password.value.trim() !== '';
};

$form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateLogin()) {
        e.currentTarget.submit();
        sessionStorage.setItem('login', true);

        const username = $username.value;
        const password = $password.value;

        if (!userExists(username, password)) createUser(username, password);

        userActiver(generateUserkey(username, password));
    }

});

