
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