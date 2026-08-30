import {
    Box, Button, Checkbox, Drawer, FormControlLabel,
    FormGroup, MenuItem, TextField, Typography,
    useMediaQuery, useTheme,
} from "@mui/material";
import type { ReactElement } from "react";
import useFilterDrawerController, {
    roomTypeFilterItems, capacityFilterItems, floorFilterItems,
} from "./use-filter-drawer-controller";

const FilterDrawer = ({
    open, onClose
}: { open: boolean; onClose: () => void }): ReactElement => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        roomTypes,
        capacity,
        floor,
        hideMaintenance,
        setRoomTypes,
        setCapacity,
        setFloor,
        setHideMaintenance,
        clearAll,
    } = useFilterDrawerController();

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
                    <Typography variant="h6">Filters</Typography>
                    <Button variant="text" onClick={onClose}>Done</Button>
                </Box>

                <FormGroup>
                    <Typography variant="subtitle2">Room type</Typography>
                    {roomTypeFilterItems.map((type) => (
                        <FormControlLabel
                            key={type}
                            label={type}
                            control={
                                <Checkbox
                                    checked={roomTypes.includes(type)}
                                    onChange={() => setRoomTypes(type)}
                                />
                            }
                        />
                    ))}
                </FormGroup>

                <TextField
                    select size="small" label="Capacity"
                    value={capacity}
                    onChange={(event) => setCapacity(event.target.value)}
                >
                    <MenuItem value="">Any</MenuItem>
                    {capacityFilterItems.map((filterItem) => (
                        <MenuItem key={filterItem} value={String(filterItem)}>{filterItem}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select size="small" label="Floor"
                    value={floor}
                    onChange={(event) => setFloor(event.target.value)}
                >
                    <MenuItem value="">Any</MenuItem>
                    {floorFilterItems.map((filterItem) => (
                        <MenuItem key={filterItem} value={String(filterItem)}>{filterItem}</MenuItem>
                    ))}
                </TextField>

                <FormControlLabel
                    label="Hide under maintenance"
                    control={
                        <Checkbox
                            checked={hideMaintenance}
                            onChange={(event) => setHideMaintenance(event.target.checked)}
                        />
                    }
                />

                <Button onClick={clearAll}>Clear all</Button>
            </Box>
        </Drawer>
    );
};

export default FilterDrawer;
