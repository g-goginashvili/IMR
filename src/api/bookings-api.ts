import type { Booking } from "../modules/bookings/booking-types";
import { http } from "../utility/http-client";

export const getBookings = async (signal?: AbortSignal): Promise<Booking[]> => {
    const fromStore = localStorage.getItem("bookingsData");
    if (fromStore) return JSON.parse(fromStore) as Booking[];

    const response: Booking[] = await http.get("/bookings.json", undefined, { signal });
    localStorage.setItem("bookingsData", JSON.stringify(response));
    return response;
};

export const cancelBooking = async (id: string) => {
    const response: Booking[] = JSON.parse(localStorage.getItem("bookingsData")!);
    const toStore = response.map(item =>
        item.id === id ? { ...item, status: "cancelled" as const } : item);
    localStorage.setItem("bookingsData", JSON.stringify(toStore));
};