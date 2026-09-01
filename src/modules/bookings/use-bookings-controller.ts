import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { cancelBooking, createBooking, updateBooking } from "../../api/bookings-api";
import type { BookingBodyType } from "../../components/booking-modal/use-booking-modal-controller";
import type { FilterField } from "../../components/filter-drawer/filter-types";
import { useBookings } from "../../hooks/use-bookings";

const useBookingsController = () => {
    const { bookings, setBookings, isLoading, error, setError } = useBookings();

    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);

    const [editorTarget, setEditorTarget] = useState<string | null>(null);

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