import axios from "axios";
import { IDM_API_URL, SIGNIN_PATH, SIGNUP_PATH } from "../Constants";


export async function SignInService(userDetails) {
    const { email, password } = userDetails;
    return axios.post(`${IDM_API_URL}${SIGNIN_PATH}`, {
        email: email,
        password: password
    });
}

export async function SignUpService(userDetails) {
    const { email, password, fname, lname } = userDetails;
    return axios.post(`${IDM_API_URL}${SIGNUP_PATH}`, {
        email: email,
        password: password,
        firstName: fname,
        lastName: lname
    });
}

export function cleanLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fName');
    localStorage.removeItem('lName');
}

export function setUserLoggedIn(message) {
    localStorage.setItem('token', message.token);
    localStorage.setItem('userId', message.user.id);
    localStorage.setItem('fName', message.user.firstName);
    localStorage.setItem('lName', message.user.lastName);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function getUserId() {
    return localStorage.getItem('userId');
}

export function getUserName() {
    const firstName = localStorage.getItem('fName') || '';
    return firstName === '' ? 'user' : firstName;
}
