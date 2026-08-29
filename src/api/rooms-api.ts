import type { Room } from "../modules/rooms/room-types";
import { http } from "../utility/http-client";

// Sleep to resemble response await.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRooms = async (signal?: AbortSignal): Promise<Room[]> => {
    await sleep(1000);
    return await http.get("/rooms.json", undefined, { signal });
};