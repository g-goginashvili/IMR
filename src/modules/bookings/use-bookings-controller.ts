import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import type { FilterField } from "../../components/filter-drawer/filter-types";
import { useBookings } from "../../hooks/use-bookings";
import { useBookingActions } from "../../hooks/use-booking-actions";

const useBookingsController = () => {
    const { bookings, setBookings, isLoading, error, setError } = useBookings();

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
    } = useBookingActions({ bookings, setBookings, setError });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [params] = useSearchParams();

    const filterFields: FilterField[] = useMemo(() => {
        const rooms = new Map(bookings.map(booking => [booking.room.id, booking.room.name]));
        return [
            {
                variant: "select",
                key: "room",
                label: "Room",
                options: [...rooms].map(([value, label]) => ({ value, label })),
            },
            {
                variant: "checkboxes",
                key: "status",
                label: "Status",
                options: [
                    { value: "confirmed", label: "Confirmed" },
                    { value: "cancelled", label: "Cancelled" },
                ],
            },
            {
                variant: "date",
                key: "from",
                label: "From"
            },
            {
                variant: "date",
                key: "to",
                label: "To"
            },
        ];
    }, [bookings]);

    const visibleBookings = useMemo(() => {
        const room = params.get("room");
        const statuses = params.get("status")?.split(",").filter(Boolean) ?? [];
        const from = params.get("from");
        const to = params.get("to");
        return bookings.filter(booking =>
            (!room || booking.room.id === room) &&
            (statuses.length === 0 || statuses.includes(booking.status)) &&
            (!from || booking.start >= from) &&
            (!to || booking.start <= `${to}T23:59:59`)
        );
    }, [bookings, params]);

    return {
        bookings,
        isLoading,
        error,
        selectedBooking,
        setSelectedBookingId,
        pendingCancel,
        setPendingCancelId,
        isCancelling,
        confirmCancel,
        isFilterOpen,
        setIsFilterOpen,
        filterFields,
        visibleBookings,
        editorTarget,
        setEditorTarget,
        editedBooking,
        handleBookingModify
    };
};

export default useBookingsController;