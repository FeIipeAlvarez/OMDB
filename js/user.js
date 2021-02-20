export { createUser, userActiver, userExists, generateUserkey, currentUser };


const createUser = (username, password) => {

    const userKey = generateUserkey(username, password);
    const user = {
        name: username.trim().toLowerCase(),
        password: password.trim().toLowerCase(),
        status: 0,
        favorites: []
    };
    localStorage.setItem(userKey, JSON.stringify(user));


};

const generateUserkey = (username, password) => `${username.trim().toLowerCase() + password.trim().toLowerCase()}`;

const currentUser = () => JSON.parse(Object.values(localStorage).find(user => JSON.parse(user).status === 1));

const userExists = (username, password) => localStorage.getItem(generateUserkey(username, password));



const userActiver = userKey => {

    for (const key of Object.keys(localStorage)) {
        const user = JSON.parse(localStorage.getItem(key));
        user.status = 0;
        localStorage.setItem(key, JSON.stringify(user));
    }

    const activeUser = JSON.parse(localStorage.getItem(userKey));

    activeUser.status = 1;

    localStorage.setItem(userKey, JSON.stringify(activeUser));
};




