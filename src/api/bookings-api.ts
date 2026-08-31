import type { Booking } from "../modules/bookings/booking-types";
import { http } from "../utility/http-client";

export const getBookings = async (signal?: AbortSignal): Promise<Booking[]> => {
    const fromStore = localStorage.getItem("bookingsData");
    if (fromStore) return JSON.parse(fromStore) as Booking[];

    const response: Booking[] = await http.get("/bookings.json", undefined, { signal });
    localStorage.setItem("bookingsData", JSON.stringify(response));
    return response;
};

export const createBooking = async (body: Omit<Booking, "id" | "status">): Promise<Booking> => {
    const response: Booking[] = JSON.parse(localStorage.getItem("bookingsData")!);
    const toStore: Booking = { ...body, id: crypto.randomUUID(), status: "confirmed" };
    localStorage.setItem("bookingsData", JSON.stringify([...response, toStore]));
    return toStore;
};

export const updateBooking = async (id: string, body: Omit<Booking, "id" | "status">): Promise<Booking> => {
    const response: Booking[] = JSON.parse(localStorage.getItem("bookingsData")!);
    const toStore: Booking = { ...body, id, status: "confirmed" };
    localStorage.setItem("bookingsData", JSON.stringify(
        response.map(item => item.id === id ? toStore : item)));
    return toStore;
};

export const cancelBooking = async (id: string) => {
    const response: Booking[] = JSON.parse(localStorage.getItem("bookingsData")!);
    const toStore = response.map(item =>
        item.id === id ? { ...item, status: "cancelled" as const } : item);
    localStorage.setItem("bookingsData", JSON.stringify(toStore));
};