import { useSearchParams } from "react-router";
import type { RoomType } from "../../modules/rooms/room-types";

export const roomTypeFilterItems: RoomType[] = ["single", "training", "conference", "boardroom"];
export const capacityFilterItems = [2, 4, 6, 8, 12, 16, 20];
export const floorFilterItems = [1, 2, 3, 4];

const paramsFilterKeys = ["type", "capacity", "floor", "hideMaintenance"];

const useFilterDrawerController = () => {
    const [params, setParams] = useSearchParams();

    const roomTypes = params.get("type")?.split(",") ?? [];
    const capacity = params.get("capacity") ?? "";
    const floor = params.get("floor") ?? "";
    const hideMaintenance = params.get("hideMaintenance") === "true";

    const set = (key: string, value: string) =>
        setParams((prev) => {
            const newParams = new URLSearchParams(prev);
            if (value) newParams.set(key, value);
            else newParams.delete(key);
            return newParams;
        });

    const setRoomTypes = (type: string) => {
        const roomTypeToAdd = roomTypes.includes(type)
            ? roomTypes.filter(item => item !== type)
            : [...roomTypes, type];
        set("type", roomTypeToAdd.join(","));
    };
    const setCapacity = (value: string) => set("capacity", value);
    const setFloor = (value: string) => set("floor", value);
    const setHideMaintenance = (checked: boolean) =>
        set("hideMaintenance", checked ? "true" : "");

    const clearAll = () =>
        setParams((prev) => {
            const newParams = new URLSearchParams(prev);
            paramsFilterKeys.forEach((key) => newParams.delete(key));
            return newParams;
        });

    return {
        roomTypes,
        capacity,
        floor,
        hideMaintenance,
        setRoomTypes,
        setCapacity,
        setFloor,
        setHideMaintenance,
        clearAll,
    };
};

export default useFilterDrawerController;
