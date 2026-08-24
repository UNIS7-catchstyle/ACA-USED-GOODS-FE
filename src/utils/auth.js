let loggedIn = false;
let userRole = null;

export function isLoggedIn() {
    return loggedIn;
}

export function login(role) {
    loggedIn = true;
    userRole = role;
}

export function getUserRole() {
    return userRole;
}

export function logout() {
    loggedIn = false;
    userRole = null;
}