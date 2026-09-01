import { useEffect, useMemo, useState } from "react";
import { useRooms } from "../../hooks/use-rooms";
import { useBookings } from "../../hooks/use-bookings";
import { todayLocal } from "../../utility/time-formatting";

const useDashboardController = () => {
    const { rooms, isLoading: isLoadingRooms, error: roomsError } = useRooms();
    const { bookings, isLoading: isLoadingBookings, error: bookingsError } = useBookings();

    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    const ongoingBookings = useMemo(() =>
        bookings
            .filter(booking =>
                (booking.status !== "cancelled") &&
                Date.parse(booking.start) <= now &&
                Date.parse(booking.end) > now)
            .sort((a, b) => a.end.localeCompare(b.end)),
        [bookings, now]);

    const stats = useMemo(() => {
        const today = todayLocal();
        const operationalRooms = rooms.filter(room => room.condition !== "maintenance");
        const occupiedRoomIds = new Set(ongoingBookings.map(booking => booking.room.id));
        const todaysBookings = bookings.filter(booking =>
            (booking.status !== "cancelled") && booking.start.startsWith(today));

        return {
            availableRooms: operationalRooms.filter(room => !occupiedRoomIds.has(room.id)).length,
            totalRooms: rooms.length,
            bookingsToday: todaysBookings.length,
            upcomingToday: todaysBookings.filter(booking => Date.parse(booking.start) > now).length,
            ongoing: ongoingBookings.length,
            maintenanceRooms: rooms.length - operationalRooms.length,
        };
    }, [rooms, bookings, ongoingBookings, now]);

    const utilisation = useMemo(() => {
        const monday = new Date(now);
        monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
        monday.setHours(0, 0, 0, 0);
        
        const weekStart = monday.getTime();
        const weekEnd = weekStart + 7 * 24 * 60 * 60000;

        const bookedMinutes = new Map<string, number>();
        bookings.filter(booking => booking.status !== "cancelled").forEach(booking => {
            const start = Date.parse(booking.start);
            const end = Date.parse(booking.end);
            if (end <= weekStart || start >= weekEnd) return;
            const minutes = (Math.min(end, weekEnd) - Math.max(start, weekStart)) / 60000;
            bookedMinutes.set(booking.room.id, (bookedMinutes.get(booking.room.id) ?? 0) + minutes);
        });

        return rooms
            .map(room => ({
                id: room.id,
                name: room.name,
                percentage: Math.min(100, Math.round(
                    ((bookedMinutes.get(room.id) ?? 0) / (24 * 60 * 7)) * 100)),
            }))
            .sort((a, b) => b.percentage - a.percentage);
    }, [rooms, bookings, now]);

    return {
        isLoading: isLoadingRooms || isLoadingBookings,
        error: roomsError ?? bookingsError,
        stats,
        ongoingBookings,
        utilisation,
    };
};

export default useDashboardController;
