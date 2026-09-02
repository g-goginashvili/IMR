import { useSearchParams } from "react-router";
import type { FilterField } from "./filter-types";

const useFilterDrawerController = (fields: FilterField[]) => {
    const [params, setParams] = useSearchParams();

    const getValue = (key: string) => params.get(key) ?? "";
    const getManyValues = (key: string) => params.get(key)?.split(",").filter(Boolean) ?? [];
    const isEnabled = (key: string) => params.get(key) === "true";

    const setValue = (key: string, value: string) =>
        setParams((prev) => {
            const newParams = new URLSearchParams(prev);
            if (value) newParams.set(key, value);
            else newParams.delete(key);
            return newParams;
        }, { replace: true });

    const setManyValues = (key: string, value: string) => {
        const current = getManyValues(key);
        const toBeAdded = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
        setValue(key, toBeAdded.join(","));
    };

    const setEnabled = (key: string, checked: boolean) =>
        setValue(key, checked ? "true" : "");

    const clearAll = () =>
        setParams((prev) => {
            const newParams = new URLSearchParams(prev);
            fields.forEach((field) => newParams.delete(field.key));
            return newParams;
        }, { replace: true });

    const activeCount = fields.filter((field) => params.get(field.key)).length;

    return {
        getValue,
        getManyValues,
        isEnabled,
        setValue,
        setManyValues,
        setEnabled,
        clearAll,
        activeCount,
    };
};

export default useFilterDrawerController;
