import { useEffect, useState } from "react";
import type { Booking } from "./booking-types";
import { getBookings } from "../../api/bookings-api";

const useBookingsController = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
        setSelectedBooking,
    };
};

export default useBookingsController;