import { useMemo } from "react";
import { useSearchParams } from "react-router";
import {
    addDays, dayMonthFormatter, monday, todayLocal, weekDays, weekdayFormatter
} from "../../utility/time-formatting";
import type { ScheduleColumn } from "./schedule-types";
import { useBookings } from "../../hooks/use-bookings";
import { useRooms } from "../../hooks/use-rooms";

export type ScheduleView = "day" | "week";

const useScheduleController = () => {
    const {
        bookings,
        isLoading: isLoadingBookings,
        error: errorBookings,
    } = useBookings();
    const {
        rooms,
        isLoading: isLoadingRooms,
        error: errorRooms,
    } = useRooms();

    const [params, setParams] = useSearchParams();

    const view: ScheduleView = params.get("view") === "week" ? "week" : "day";
    const date = params.get("date") ?? todayLocal();
    
    const selectedRoomId = params.get("room") ?? rooms[0]?.id ?? "";

    const updateParams = (updates: Record<string, string>) => {
        setParams(previous => {
            const newParams = new URLSearchParams(previous);
            Object.entries(updates).forEach(([key, value]) => newParams.set(key, value));
            return newParams;
        }, { replace: true });
    };

    const setView = (viewParam: ScheduleView) => updateParams({ view: viewParam });
    const setDate = (dateParam: string) => updateParams({ date: dateParam });
    const setRoom = (roomParam: string) => updateParams({ room: roomParam });
    
    const shift = (direction: 1 | -1) =>
        setDate(addDays(date, view === "day" ? direction : direction * 7));

    const goToToday = () => setDate(todayLocal());

    const isToday = view === "day"
        ? date === todayLocal()
        : monday(date) === monday(todayLocal());

    const columns: ScheduleColumn[] = useMemo(() => {
        const bookingsOf = (day: string, roomId: string) => bookings.filter(booking =>
            booking.status !== "cancelled" &&
            booking.room.id === roomId &&
            booking.start.slice(0, 10) === day);

        if (view === "day") {
            return rooms.map(room => ({
                roomId: room.id,
                date,
                label: room.name,
                sublabel: `floor ${room.floor} · seats ${room.capacity}`,
                bookings: bookingsOf(date, room.id),
            }));
        }

        return weekDays(date).map(day => ({
            roomId: selectedRoomId,
            date: day,
            label: weekdayFormatter(day),
            sublabel: dayMonthFormatter(day),
            bookings: selectedRoomId ? bookingsOf(day, selectedRoomId) : [],
        }));
    }, [view, rooms, bookings, date, selectedRoomId]);

    const rangeLabel = view === "day"
        ? `${weekdayFormatter(date)}, ${dayMonthFormatter(date)}`
        : `${dayMonthFormatter(monday(date))} - ${dayMonthFormatter(addDays(monday(date), 6))}`;

    return {
        bookings,
        rooms,
        isLoading: isLoadingBookings || isLoadingRooms,
        error: errorBookings ?? errorRooms,
        view,
        setView,
        date,
        setDate,
        selectedRoomId,
        setRoom,
        columns,
        shift,
        goToToday,
        isToday,
        rangeLabel,
    };
};

export default useScheduleController;
