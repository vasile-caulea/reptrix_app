import axios from "axios";


const API_URL = 'http://localhost:3001';
const LOGIN_PATH = '/signin';
const SIGNUP_PATH = '/signup';


export async function SignInService(userDetails) {
    const { email, password } = userDetails;
    return axios.post(`${API_URL}${LOGIN_PATH}`, {
        email: email,
        password: password
    });
}

export async function SignUpService(userDetails) {
    const { email, password, fname, lname } = userDetails;
    return axios.post(`${API_URL}${SIGNUP_PATH}`, {
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
    return `${localStorage.getItem('fName')} ${localStorage.getItem('lName')}`;
}
