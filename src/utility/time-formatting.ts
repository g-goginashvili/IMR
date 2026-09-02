export const toIso = (date: string, time: string) => `${date}T${time}:00`;

const pad = (value: number) => String(value).padStart(2, "0");

const toDateString = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayLocal = () => toDateString(new Date());

export const formatDay = (iso: string) => new Date(iso).toLocaleDateString(undefined, {
    weekday: "short", day: "numeric", month: "short",
});

export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit", minute: "2-digit", hour12: false,
});

export const formatDuration = (start: string, end: string) => {
    const minutes = Math.round((Date.parse(end) - Date.parse(start)) / 60000);
    const hours = Math.floor(minutes / 60);
    return [hours && `${hours}h`, minutes % 60 && `${minutes % 60}m`].join(" ");
};

const toDateObject = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
};

export const addDays = (date: string, amount: number) => {
    const shifted = toDateObject(date);
    shifted.setDate(shifted.getDate() + amount);
    return toDateString(shifted);
};

export const monday = (date: string) =>
    addDays(date, -((toDateObject(date).getDay() + 6) % 7));

export const minutesIntoDay = (iso: string) =>
    Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16));

export const toTimeOfDay = (minutes: number) =>
    `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

export const weekDays = (anchor: string) => {
    const weekStart = monday(anchor);
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
};

export const weekdayFormatter = (date: string) =>
    toDateObject(date).toLocaleDateString(undefined, { weekday: "short" });

export const dayMonthFormatter = (date: string) =>
    toDateObject(date).toLocaleDateString(undefined, { day: "numeric", month: "short" });