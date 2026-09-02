import { useMemo, useState } from "react";
import type { RoomType } from "./room-types";
import { useSearchParams } from "react-router";
import type { FilterField } from "../../components/filter-drawer/filter-types";
import { useRooms } from "../../hooks/use-rooms";

const roomTypeFilterItems: RoomType[] = ["single", "training", "conference", "boardroom"];

const useRoomsController = () => {
    const { rooms, isLoading, error } = useRooms();

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
        const roomTypes = params.get("type")?.split(",").filter(Boolean) ?? [];
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
