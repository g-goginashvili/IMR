import { useEffect, useState } from "react";
import type { Booking } from "./booking-types";
import { cancelBooking, getBookings } from "../../api/bookings-api";

const useBookingsController = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);

    const selectedBooking = bookings.find(booking => booking.id === selectedBookingId) ?? null;
    const pendingCancel = bookings.find(booking => booking.id === pendingCancelId) ?? null;

    const confirmCancel = async () => {
        setError(null);
        setIsCancelling(true);
        try {
            await cancelBooking(pendingCancelId!);
            setBookings(previous => previous.map(booking =>
                booking.id === pendingCancelId ? { ...booking, status: "cancelled" as const } : booking
            ));
            setPendingCancelId(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to cancel booking");
        } finally {
            setIsCancelling(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getBookings(controller.signal);
                setBookings(response);
                setIsLoading(false);
            } catch (error) {
                if (controller.signal.aborted) return;
                setBookings([]);
                setError(error instanceof Error ? error.message : "Failed to load bookings");
                setIsLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    return {
        bookings,
        isLoading,
        error,
        selectedBooking,
        setSelectedBookingId,
        pendingCancel,
        setPendingCancelId,
        isCancelling,
        confirmCancel
    };
};

export default useBookingsController;