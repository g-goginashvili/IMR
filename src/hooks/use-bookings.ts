import { getBookings } from "../api/bookings-api";
import type { Booking } from "../modules/bookings/booking-types";
import { useResource } from "./use-resource";

export const useBookings = () => {
    const [
        bookings,
        setBookings,
        isLoading,
        error,
        setError
    ] = useResource<Booking[]>(getBookings, [], "Failed to load bookings.");

    return {
        bookings,
        setBookings,
        isLoading,
        error,
        setError
    };
};