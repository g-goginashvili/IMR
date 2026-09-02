import type { Room } from "../modules/rooms/room-types";
import { http } from "../utility/http-client";

export const getRooms = async (signal?: AbortSignal): Promise<Room[]> => {
    return await http.get("/rooms.json", undefined, { signal });
};