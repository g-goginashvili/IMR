import { useSearchParams } from "react-router";
import {
    addDays, dayMonthFormatter, monday, todayLocal, weekdayFormatter
} from "../../utility/time-formatting";

export type ScheduleView = "day" | "week";

const useScheduleController = () => {
    const [params, setParams] = useSearchParams();

    const view: ScheduleView = params.get("view") === "week" ? "week" : "day";
    const date = params.get("date") ?? todayLocal();

    const updateParams = (updates: Record<string, string>) => {
        setParams(previous => {
            const newParams = new URLSearchParams(previous);
            Object.entries(updates).forEach(([key, value]) => newParams.set(key, value));
            return newParams;
        }, { replace: true });
    };

    const setView = (viewParam: ScheduleView) => updateParams({ view: viewParam });
    const setDate = (dateParam: string) => updateParams({ date: dateParam });
    
    const shift = (direction: 1 | -1) =>
        setDate(addDays(date, view === "day" ? direction : direction * 7));

    const goToToday = () => setDate(todayLocal());

    const isToday = view === "day"
        ? date === todayLocal()
        : monday(date) === monday(todayLocal());

    const rangeLabel = view === "day"
        ? `${weekdayFormatter(date)}, ${dayMonthFormatter(date)}`
        : `${dayMonthFormatter(monday(date))} - ${dayMonthFormatter(addDays(monday(date), 6))}`;

    return {
        view,
        setView,
        date,
        setDate,
        shift,
        goToToday,
        isToday,
        rangeLabel,
    };
};

export default useScheduleController;
