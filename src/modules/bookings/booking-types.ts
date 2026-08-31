export type Booking = {
    id: string;
    room: {
        id: string;
        name: string;
    },
    title: string;
    description?: string;
    organizer: {
        name: string;
        email: string
    };
    start: string;
    end: string;
    status: "confirmed" | "cancelled";
};