import {
    Box, Button, Checkbox, Drawer, FormControlLabel,
    FormGroup, MenuItem, TextField, Typography,
    useMediaQuery, useTheme,
} from "@mui/material";
import type { ReactElement } from "react";
import type { FilterField } from "./filter-types";
import useFilterDrawerController from "./use-filter-drawer-controller";

const FilterDrawer = ({
    open, onClose, fields, title = "Filters"
}: {
    open: boolean;
    onClose: () => void;
    fields: FilterField[];
    title?: string;
}): ReactElement => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        getValue,
        getManyValues,
        isEnabled,
        setValue,
        setManyValues,
        setEnabled,
        clearAll,
    } = useFilterDrawerController(fields);

    const FilterField = (field: FilterField) => {
        switch (field.variant) {
            case "checkboxes": {
                const chosen = getManyValues(field.key);
                return (
                    <FormGroup key={field.key}>
                        <Typography variant="subtitle2">{field.label}</Typography>
                        {field.options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                label={option.label}
                                control={
                                    <Checkbox
                                        checked={chosen.includes(option.value)}
                                        onChange={() => setManyValues(field.key, option.value)}
                                    />
                                }
                            />
                        ))}
                    </FormGroup>
                );
            }
            case "select":
                return (
                    <TextField
                        key={field.key}
                        select size="small" label={field.label}
                        value={getValue(field.key)}
                        onChange={(event) => setValue(field.key, event.target.value)}
                    >
                        <MenuItem value="">Any</MenuItem>
                        {field.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            case "toggle":
                return (
                    <FormControlLabel
                        key={field.key}
                        label={field.label}
                        control={
                            <Checkbox
                                checked={isEnabled(field.key)}
                                onChange={(event) => setEnabled(field.key, event.target.checked)}
                            />
                        }
                    />
                );
            case "date":
                return (
                    <TextField
                        key={field.key}
                        type="date" size="small" label={field.label}
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={getValue(field.key)}
                        onChange={(event) => setValue(field.key, event.target.value)}
                    />
                );
        }
    };

    return (
        <Drawer
            anchor={isSmall ? "bottom" : "right"}
            open={open}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: isSmall ? "100%" : 280,
                    boxSizing: "border-box",
                },
            }}
        >
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">{title}</Typography>
                    <Button variant="text" onClick={onClose}>Done</Button>
                </Box>

                {fields.map(FilterField)}

                <Button onClick={clearAll}>Clear all</Button>
            </Box>
        </Drawer>
    );
};

export default FilterDrawer;
