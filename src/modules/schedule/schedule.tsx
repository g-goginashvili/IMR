import type { ReactElement } from "react";
import MainLayout from "../../components/main-layout/main-layout";
import useScheduleController from "./use-schedule-controller";
import ScheduleGrid from "./schedule-grid";
import BookingDetailsModal from "../bookings/booking-details-modal";
import BookingCancelDialog from "../bookings/booking-cancel-dialog";
import BookingModal from "../../components/booking-modal/booking-modal";
import {
    Box, Button, IconButton, MenuItem, TextField,
    ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import type { ScheduleView } from "./use-schedule-controller";

const Schedule = (): ReactElement => {
    const {
        bookings,
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
        selectedBooking,
        setSelectedBookingId,
        rangeLabel,
        shift,
        goToToday,
        isToday,
        pendingCancel,
        setPendingCancelId,
        isCancelling,
        confirmCancel,
        editorTarget,
        setEditorTarget,
        editedBooking,
        handleBookingModify,
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
            <BookingCancelDialog
                booking={pendingCancel}
                isCancelling={isCancelling}
                onClose={() => setPendingCancelId(null)}
                onConfirm={confirmCancel}
            />

            <BookingDetailsModal
                booking={selectedBooking}
                onClose={() => setSelectedBookingId(null)}
                onCancel={() => selectedBooking && setPendingCancelId(selectedBooking.id)}
                onEdit={() => {
                    if (!selectedBooking) return;
                    setEditorTarget(selectedBooking.id);
                    setSelectedBookingId(null);
                }}
            />

            {editorTarget && (
                <BookingModal
                    key={editorTarget}
                    isOpen
                    onClose={() => setEditorTarget(null)}
                    onSubmit={handleBookingModify}
                    bookings={bookings}
                    booking={editedBooking}
                />
            )}

            <ScheduleGrid
                columns={columns}
                onBookingClick={setSelectedBookingId}
            />
        </MainLayout>
    );
};

export default Schedule;
