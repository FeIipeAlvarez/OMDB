export { createLocalStorageUsers, createUser, userActiver, userExists, generateUserkey, currentUser, validateUser };

//Es para redireccionar al login sino se intenta acceder sin suminitrar un usuario o contraseña.
const validateUser = () => {
    if (!sessionStorage.getItem('login')) {
        window.location.href = '../index.html';
    }
};

//En este item del localStorage se guardarán todos los usuarios.
const createLocalStorageUsers = () => !localStorage.getItem('usersOMDB') ?
    localStorage.setItem('usersOMDB', '[]') : '';

//Key para cada usuario, es un string uniendo el usuario y la contraseña. Con este key se guardará en el localstorage.
const generateUserkey = (username, password) => `${username.trim().toLowerCase() + password.trim().toLowerCase()}`;

//Los usuarios se crean al momento de loguearse, cada usuario se diferencian por su usuario y su contraseña.
const createUser = (username, password) => {

    const userKey = generateUserkey(username, password);
    const users = JSON.parse(localStorage.getItem('usersOMDB'));
    const user = {};
    user[userKey] = {
        name: username.trim().toLowerCase(),
        password: password.trim().toLowerCase(),
        status: 0,
        favorites: []
    };

    users.push(user);

    localStorage.setItem('usersOMDB', JSON.stringify(users));
};


//Retorna un objeto(usuario) con el estado == 1, osea el usuario que esta logueado en el momento.
const currentUser = () => {
    const users = JSON.parse(localStorage.getItem('usersOMDB'));

    const userFound = users.find(user => user[Object.keys(user)[0]].status === 1);

    return userFound[Object.keys(userFound)[0]];
};


//Retorna un boolean si el usuario ya ha sido creado o no.
const userExists = (username, password) =>
    JSON.parse(localStorage.getItem('usersOMDB'))
        .some(user => generateUserkey(username, password) === Object.keys(user)[0]);


//Función para actualizar el estado de los usuarios, todos quedarán en estado 0 excepto el que este logueado, este tendra estado = 1.
const userActiver = userKey => {

    const users = JSON.parse(localStorage.getItem('usersOMDB'));

    const usersStatusUpdated = users.map(user => {

        const key = Object.keys(user)[0];

        const userUpdated = {};

        userUpdated[key] = {
            name: user[key].name,
            password: user[key].password,
            status: key === userKey ? 1 : 0,
            favorites: user[key].favorites
        };

        return userUpdated;

    });

    localStorage.setItem('usersOMDB', JSON.stringify(usersStatusUpdated));

};




