import type { ReactElement } from "react";
import MainLayout from "../../components/main-layout/main-layout";
import useScheduleController from "./use-schedule-controller";
import ScheduleGrid from "./schedule-grid";
import {
    Box, Button, IconButton, MenuItem, TextField,
    ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import type { ScheduleView } from "./use-schedule-controller";

const Schedule = (): ReactElement => {
    const {
        rooms,
        isLoading,
        error,
        view,
        setView,
        date,
        setDate,
        selectedRoomId,
        setRoom,
        columns,
        rangeLabel,
        shift,
        goToToday,
        isToday,
    } = useScheduleController();

    return (
        <MainLayout
            headerTitle="Schedule"
            error={error}
            isLoading={isLoading}
            headerActions={
                <>
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={view}
                        onChange={(_, nextView: ScheduleView | null) => nextView && setView(nextView)}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        <ToggleButton value="day" sx={{ flex: { xs: 1, sm: "none" }, px: 2 }}>
                            Day
                        </ToggleButton>
                        <ToggleButton value="week" sx={{ flex: { xs: 1, sm: "none" }, px: 2 }}>
                            Week
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5,
                        width: { xs: "100%", sm: "auto" },
                    }}>
                        <IconButton onClick={() => shift(-1)}>
                            <ChevronLeft />
                        </IconButton>
                        <Button
                            variant="outlined"
                            disabled={isToday}
                            onClick={goToToday}
                            sx={{ minWidth: { xs: 120, sm: 160 } }}
                        >
                            {rangeLabel}
                        </Button>
                        <IconButton onClick={() => shift(1)}>
                            <ChevronRight />
                        </IconButton>
                    </Box>

                    <TextField
                        size="small"
                        type="date"
                        value={date}
                        onChange={event => setDate(event.target.value)}
                    />

                    {view === "week" && (
                        <TextField
                            select
                            size="small"
                            label="Room"
                            value={rooms.length ? selectedRoomId : ""}
                            onChange={event => setRoom(event.target.value)}
                            sx={{ minWidth: 160 }}
                        >
                            {rooms.map(room => (
                                <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
                            ))}
                        </TextField>
                    )}
                </>
            }
        >
            <ScheduleGrid columns={columns} />
        </MainLayout>
    );
};

export default Schedule;
