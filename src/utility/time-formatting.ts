export const formatDay = (iso: string) => new Date(iso).toLocaleDateString(undefined, {
    weekday: "short", day: "numeric", month: "short",
});

export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit", minute: "2-digit",
});

export const formatDuration = (start: string, end: string) => {
    const minutes = Math.round((Date.parse(end) - Date.parse(start)) / 60_000);
    const hours = Math.floor(minutes / 60);
    return [hours && `${hours}h`, minutes % 60 && `${minutes % 60}m`].filter(Boolean).join(" ");
};