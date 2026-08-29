import { useEffect, useState } from "react";
import type { Room } from "./room-types";
import { getRooms } from "../../api/rooms-api";

const useRoomsController = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getRooms(controller.signal);
                setRooms(response);
                setIsLoading(false);
            } catch (error) {
                if (controller.signal.aborted) return;
                setRooms([]);
                setError(error instanceof Error ? error.message : "Failed to load rooms");
                setIsLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    return {
        rooms,
        isLoading,
        error
    };
};

export default useRoomsController;
