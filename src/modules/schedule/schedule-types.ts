import type { Booking } from "../bookings/booking-types";

export type ScheduleColumn = {
    roomId: string;
    date: string;
    label: string;
    sublabel?: string;
    bookings: Booking[];
};
