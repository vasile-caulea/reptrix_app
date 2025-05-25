import axios from "axios";
import { IDM_API_URL } from "../Constants";
import { getAuthHeaders } from "./Utils";

export function getUserProfile() {
    const { userId, headers } = getAuthHeaders();

    return axios.get(`${IDM_API_URL}/users/${userId}`, {
        headers: headers
    });
}

export function updateUserProfile(data) {
    const { userId, headers } = getAuthHeaders();

    return axios.patch(`${IDM_API_URL}/users/${userId}`, data, {
        headers: headers
    });
}

export function deleteUserAccount() {
    const { userId, headers } = getAuthHeaders();

    return axios.delete(`${IDM_API_URL}/users/${userId}`, {
        headers: headers
    });
}
