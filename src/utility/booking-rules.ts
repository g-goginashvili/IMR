import type { Booking } from "../modules/bookings/booking-types";

export const isPastTime = (iso: string) => Date.parse(iso) <= Date.now();

export const isPast = (booking: Booking) => isPastTime(booking.start);

export const isEditable = (booking: Booking) =>
    booking.status !== "cancelled" && !isPast(booking);
