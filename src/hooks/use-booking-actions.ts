import { useState, type Dispatch, type SetStateAction } from "react";
import type { Booking } from "../modules/bookings/booking-types";
import { cancelBooking, createBooking, updateBooking } from "../api/bookings-api";
import type { BookingBodyType } from "../components/booking-modal/use-booking-modal-controller";

type BookingActionsParams = {
    bookings: Booking[];
    setBookings: Dispatch<SetStateAction<Booking[]>>;
    setError: Dispatch<SetStateAction<string | null>>;
};

export const useBookingActions = ({
    bookings, setBookings, setError
}: BookingActionsParams) => {
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [editorTarget, setEditorTarget] = useState<string | null>(null);

    const selectedBooking = bookings.find(booking => booking.id === selectedBookingId) ?? null;
    const pendingCancel = bookings.find(booking => booking.id === pendingCancelId) ?? null;
    const editedBooking = bookings.find(booking => booking.id === editorTarget);

    const handleBookingModify = async (body: BookingBodyType) => {
        if (editedBooking) {
            const updated = await updateBooking(editedBooking.id, body);
            setBookings(previous => previous.map(booking =>
                booking.id === updated.id ? updated : booking));
            return;
        }
        const created = await createBooking(body);
        setBookings(previous => [...previous, created]);
    };

    const confirmCancel = async () => {
        setError(null);
        setIsCancelling(true);
        try {
            await cancelBooking(pendingCancelId!);
            setBookings(previous => previous.map(booking =>
                booking.id === pendingCancelId ? { ...booking, status: "cancelled" as const } : booking
            ));
            setPendingCancelId(null);
            setSelectedBookingId(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to cancel booking");
        } finally {
            setIsCancelling(false);
        }
    };

    return {
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
    };
};
