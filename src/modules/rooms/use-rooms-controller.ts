import { useEffect, useMemo, useState } from "react";
import type { Room } from "./room-types";
import { getRooms } from "../../api/rooms-api";
import { useSearchParams } from "react-router";

const useRoomsController = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [params] = useSearchParams();

    const visibleRooms = useMemo(() => {
        const roomTypes = params.get("type")?.split(",") ?? [];
        const capacity = Number(params.get("capacity"));
        const floor = params.get("floor");
        const hideMaintenance = params.get("hideMaintenance") === "true";
        return rooms.filter((room) =>
            (roomTypes.length === 0 || roomTypes.includes(room.roomType)) &&
            (!capacity || room.capacity === capacity) &&
            (!floor || String(room.floor) === floor) &&
            (!hideMaintenance || room.condition !== "maintenance")
        );
    }, [rooms, params]);

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
        error,
        isFilterOpen,
        setIsFilterOpen,
        visibleRooms
    };
};

export default useRoomsController;
