export type RoomType =
    | "single"
    | "training"
    | "conference"
    | "boardroom";

export type RoomCondition = "operational" | "maintenance";

export type Room = {
    id: string;
    name: string;
    floor: number;
    capacity: number;
    roomType: RoomType;
    amenities: string[];
    photoUrl?: string;
    description?: string;
    condition: RoomCondition;
};