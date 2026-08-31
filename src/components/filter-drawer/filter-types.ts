export type FilterProperty = {
    value: string;
    label: string;
};

type FilterFieldBase = {
    key: string;
    label: string;
};

export type CheckboxesFilterField = FilterFieldBase & {
    variant: "checkboxes";
    options: FilterProperty[];
};

export type SelectFilterField = FilterFieldBase & {
    variant: "select";
    options: FilterProperty[];
};

export type ToggleFilterField = FilterFieldBase & {
    variant: "toggle";
};

export type DateFilterField = FilterFieldBase & {
    variant: "date";
};

export type FilterField =
    | CheckboxesFilterField
    | SelectFilterField
    | ToggleFilterField
    | DateFilterField;
