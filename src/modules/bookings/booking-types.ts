export type Booking = {
    id: string;
    roomId: string;
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