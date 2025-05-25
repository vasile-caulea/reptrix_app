import { getToken } from "./Auth";

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function getWeekStartAndEnd() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - diffToMonday);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const startDate = formatDate(startOfWeek);
    const endDate = formatDate(today);
    return { startDate, endDate };
}

export function getFormattedDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
export const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export function getAuthHeaders() {
    const token = getToken();
    if (!token) {
        throw new Error('You must be logged in.');
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
        throw new Error('User ID not found.');
    }

    return {
        userId,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}