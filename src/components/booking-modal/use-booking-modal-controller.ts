import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Booking } from "../../modules/bookings/booking-types";
import type { Room } from "../../modules/rooms/room-types";
import { getRooms } from "../../api/rooms-api";
import { toIso, todayLocal } from "../../utility/time-formatting";

export type BookingBodyType = Omit<Booking, "id" | "status">;

export type BookingFormValues = {
    title: string;
    description: string;
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    organizerName: string;
    organizerEmail: string;
};

const formInitialValues = (booking?: Booking): BookingFormValues => ({
    title: booking?.title ?? "",
    description: booking?.description ?? "",
    roomId: booking?.room.id ?? "",
    date: booking?.start.slice(0, 10) ?? todayLocal(),
    startTime: booking?.start.slice(11, 16) ?? "09:00",
    endTime: booking?.end.slice(11, 16) ?? "10:00",
    organizerName: booking?.organizer.name ?? "",
    organizerEmail: booking?.organizer.email ?? "",
});

const useBookingModalController = ({
    onClose, onSubmit, bookings, booking
}: {
    onClose: () => void;
    onSubmit: (body: BookingBodyType) => Promise<void>;
    bookings: Booking[];
    booking?: Booking;
}) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(true);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const validationSchema = useMemo(() => Yup.object({
        title: Yup.string().trim().required("Title is required"),
        description: Yup.string(),
        roomId: Yup.string().required("Room is required"),
        date: Yup.string().required("Date is required"),
        startTime: Yup.string().required("Start time is required"),
        endTime: Yup.string()
            .required("End time is required")
            .test("after-start", "End must be after start", function (endTime) {
                const { startTime } = this.parent as BookingFormValues;
                return !startTime || !endTime || endTime > startTime;
            })
            .test("no-overlap", "Room is already booked", function (endTime) {
                const { date, startTime, roomId } = this.parent as BookingFormValues;
                if (!date || !startTime || !endTime || !roomId) return true;

                const start = toIso(date, startTime);
                const end = toIso(date, endTime);
                const clash = bookings.find(item =>
                    item.id !== booking?.id &&
                    item.room.id === roomId &&
                    item.status !== "cancelled" &&
                    start < item.end && item.start < end
                );

                return clash ? this.createError({
                    message: `Clashes with "${clash.title}" (${clash.start.slice(11, 16)}–${clash.end.slice(11, 16)})`,
                }) : true;
            }),
        organizerName: Yup.string().trim().required("Organizer is required"),
        organizerEmail: Yup.string().trim().email("Invalid email").required("Email is required"),
    }), [bookings, booking?.id]);

    const formik = useFormik<BookingFormValues>({
        initialValues: formInitialValues(booking),
        validationSchema,
        onSubmit: async (values) => {
            setSubmitError(null);
            const room = rooms.find(item => item.id === values.roomId)!;
            try {
                await onSubmit({
                    title: values.title.trim(),
                    ...(values.description && { description: values.description.trim() }),
                    room: { id: room.id, name: room.name },
                    organizer: {
                        name: values.organizerName.trim(),
                        email: values.organizerEmail.trim(),
                    },
                    start: toIso(values.date, values.startTime),
                    end: toIso(values.date, values.endTime),
                });
                onClose();
            } catch (error) {
                setSubmitError(error instanceof Error ? error.message : "Failed to make an opperation.");
            }
        },
    });

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setIsLoadingRooms(true);
            try {
                const response = await getRooms(controller.signal);
                setRooms(response);
                setIsLoadingRooms(false);
            } catch (error) {
                if (controller.signal.aborted) return;
                setRooms([]);
                setSubmitError(error instanceof Error ? error.message : "Failed to load rooms");
                setIsLoadingRooms(false);
            }
        })();

        return () => controller.abort();
    }, []);

    const selectableRooms = rooms.filter(room => room.condition === "operational");

    return {
        formik,
        isLoadingRooms,
        submitError,
        selectableRooms
    };
};

export default useBookingModalController;
