import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
    addDays, dayMonthFormatter, monday, todayLocal, toIso, toTimeOfDay, weekDays, weekdayFormatter
} from "../../utility/time-formatting";
import type { ScheduleColumn } from "./schedule-types";
import { useBookings } from "../../hooks/use-bookings";
import { useRooms } from "../../hooks/use-rooms";
import { useBookingActions } from "../../hooks/use-booking-actions";
import type { BookingDefaults } from "../../components/booking-modal/use-booking-modal-controller";
import { DAY_END_HOUR } from "./use-schedule-grid-controller";
import { isPastTime } from "../../utility/booking-rules";

export type ScheduleView = "day" | "week";

const useScheduleController = () => {
    const {
        bookings,
        setBookings,
        isLoading: isLoadingBookings,
        error: errorBookings,
        setError: setErrorBookings
    } = useBookings();
    const {
        rooms,
        isLoading: isLoadingRooms,
        error: errorRooms,
    } = useRooms();

    const {
        selectedBooking,
        setSelectedBookingId,
        pendingCancel,
        setPendingCancelId,
        isCancelling,
        confirmCancel,
        editorTarget,
        setEditorTarget,
        editedBooking,
        handleBookingModify,
    } = useBookingActions({ bookings, setBookings, setError: setErrorBookings });

    const [newBookingDefaults, setNewBookingDefaults] = useState<BookingDefaults>();

    const [params, setParams] = useSearchParams();

    const view: ScheduleView = params.get("view") === "week" ? "week" : "day";
    const date = params.get("date") ?? todayLocal();

    const bookableRooms = useMemo(() =>
        rooms.filter(room => room.condition === "operational"),
        [rooms]);

    const roomParam = params.get("room");
    const selectedRoomId =
        bookableRooms.find(room => room.id === roomParam)?.id ?? bookableRooms[0]?.id ?? "";

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
            return bookableRooms.map(room => ({
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
    }, [view, bookableRooms, bookings, date, selectedRoomId]);

    const openSlotEditor = (column: ScheduleColumn, startMinutes: number) => {
        if (isPastTime(toIso(column.date, toTimeOfDay(startMinutes)))) return;

        setNewBookingDefaults({
            roomId: column.roomId,
            date: column.date,
            startTime: toTimeOfDay(startMinutes),
            endTime: toTimeOfDay(Math.min(startMinutes + 60, DAY_END_HOUR * 60)),
        });
        setEditorTarget("new");
    };

    const openEmptyEditor = () => {
        setNewBookingDefaults({ date });
        setEditorTarget("new");
    };

    const rangeLabel = view === "day"
        ? `${weekdayFormatter(date)}, ${dayMonthFormatter(date)}`
        : `${dayMonthFormatter(monday(date))} - ${dayMonthFormatter(addDays(monday(date), 6))}`;

    return {
        bookings,
        rooms: bookableRooms,
        isLoading: isLoadingBookings || isLoadingRooms,
        error: errorBookings ?? errorRooms,
        view,
        setView,
        date,
        setDate,
        selectedRoomId,
        setRoom,
        columns,
        selectedBooking,
        setSelectedBookingId,
        shift,
        goToToday,
        isToday,
        rangeLabel,
        pendingCancel,
        setPendingCancelId,
        isCancelling,
        confirmCancel,
        editorTarget,
        setEditorTarget,
        editedBooking,
        handleBookingModify,
        newBookingDefaults,
        openSlotEditor,
        openEmptyEditor,
    };
};

export default useScheduleController;
