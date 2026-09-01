import { getRooms } from "../api/rooms-api";
import type { Room } from "../modules/rooms/room-types";
import { useResource } from "./use-resource";

export const useRooms = () => {
    const [
        rooms,
        setRooms,
        isLoading,
        error,
        setError
    ] = useResource<Room[]>(getRooms, [], "Failed to load rooms.");

    return {
        rooms,
        setRooms,
        isLoading,
        error,
        setError
    };
};