import { useEffect, useMemo, useState } from "react";
import type { Room, RoomType } from "./room-types";
import { getRooms } from "../../api/rooms-api";
import { useSearchParams } from "react-router";
import type { FilterField } from "../../components/filter-drawer/filter-types";

const roomTypeFilterItems: RoomType[] = ["single", "training", "conference", "boardroom"];

const useRoomsController = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [params] = useSearchParams();

    const filterFields: FilterField[] = useMemo(() => {
        const toFilterOptions = (values: number[]) =>
            [...new Set(values)].sort((a, b) => a - b)
                .map((value) => ({ value: String(value), label: String(value) }));

        return [
            {
                variant: "checkboxes",
                key: "type",
                label: "Room type",
                options: roomTypeFilterItems.map((type) => ({ value: type, label: type })),
            },
            {
                variant: "select",
                key: "capacity",
                label: "Capacity",
                options: toFilterOptions(rooms.map((room) => room.capacity)),
            },
            {
                variant: "select",
                key: "floor",
                label: "Floor",
                options: toFilterOptions(rooms.map((room) => room.floor)),
            },
            {
                variant: "toggle",
                key: "hideMaintenance",
                label: "Hide under maintenance"
            },
        ];
    }, [rooms]);

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
        filterFields,
        visibleRooms
    };
};

export default useRoomsController;
