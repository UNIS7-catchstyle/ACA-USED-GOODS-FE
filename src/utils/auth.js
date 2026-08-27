import { getAccessToken } from '../api/client'
import { logoutFromServer, withdrawFromServer } from '../api/auth'

export function isLoggedIn() {
    return Boolean(getAccessToken());
}

export async function logout() {
    return logoutFromServer();
}

export async function withdraw() {
    return withdrawFromServer();
}