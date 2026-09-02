import type { ReactElement } from "react";
import MainLayout from "../../components/main-layout/main-layout";
import useScheduleController from "./use-schedule-controller";
import {
    Box, Button, IconButton, TextField,
    ToggleButton, ToggleButtonGroup, Typography
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import type { ScheduleView } from "./use-schedule-controller";

const Schedule = (): ReactElement => {
    const {
        view,
        setView,
        date,
        setDate,
        rangeLabel,
        shift,
        goToToday,
        isToday,
    } = useScheduleController();

    return (
        <MainLayout
            headerTitle="Schedule"
            error={null}
            isLoading={false}
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
                </>
            }
        >
            <Typography>{view}</Typography>
            <Typography>{date}</Typography>
        </MainLayout>
    );
};

export default Schedule;
