import {
    Avatar, Box, Button, Card, CardContent, Chip, Divider, IconButton, Typography
} from "@mui/material";
import { AccessTime, EditOutlined, CloseOutlined, PunchClock, FilterAlt, Add } from "@mui/icons-material";
import { type ReactElement } from "react";
import MainLayout from "../../components/main-layout/main-layout";
import useBookingsController from "./use-bookings-controller";
import BookingCancelDialog from "./booking-cancel-dialog";
import BookingDetailsModal from "./booking-details-modal";
import { formatDay, formatDuration, formatTime } from "../../utility/time-formatting";
import { isEditable } from "../../utility/booking-rules";
import FilterDrawer from "../../components/filter-drawer/filter-drawer";
import BookingModal from "../../components/booking-modal/booking-modal";

const Bookings = (): ReactElement => {
    const {
        bookings,
        isLoading,
        error,
        selectedBooking,
        setSelectedBookingId,
        pendingCancel,
        setPendingCancelId,
        isCancelling,
        confirmCancel,
        isFilterOpen,
        setIsFilterOpen,
        filterFields,
        visibleBookings,
        editorTarget,
        setEditorTarget,
        editedBooking,
        handleBookingModify,
    } = useBookingsController()

    return (
        <MainLayout
            headerTitle="Bookings"
            error={error}
            isLoading={isLoading}
            headerActions={
                <>
                    <Button
                        variant="contained"
                        onClick={() => setEditorTarget("new")}
                    >
                        <Add /> Add
                    </Button>
                    <IconButton onClick={() => setIsFilterOpen(true)}>
                        <FilterAlt />
                    </IconButton>
                </>
            }
        >
            <FilterDrawer
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                fields={filterFields}
            />

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
            <Box
                component="section"
                sx={{
                    p: 2,
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                }}
            >
                {!isLoading && !error && visibleBookings.map(booking =>
                    <Card
                        component="article"
                        elevation={3}
                        key={booking.id}
                        onClick={() => setSelectedBookingId(booking.id)}
                        sx={{
                            p: 1,
                            opacity: isEditable(booking) ? 1 : 0.65,
                            transition: "transform 150ms ease, box-shadow 150ms ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
                                    <PunchClock />
                                </Avatar>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
                                        {booking.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {booking.organizer.name}
                                    </Typography>
                                </Box>
                                <Chip
                                    size="small"
                                    label={booking.status === "cancelled" ? "Cancelled" : formatDay(booking.start)}
                                    color={booking.status === "cancelled" ? "warning" : "default"}
                                    sx={{ fontWeight: 500 }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    mt: 3,
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr auto",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        {formatTime(booking.start)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Start
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {booking.room.name}
                                    </Typography>
                                    <Box sx={{ width: "100%", borderTop: 1, borderColor: "divider" }} />
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDuration(booking.start, booking.end)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ textAlign: "right" }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        {formatTime(booking.end)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        End
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2, borderStyle: "dashed" }} />

                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<CloseOutlined />}
                                    disabled={!isEditable(booking)}
                                    onClick={(event) => { event.stopPropagation(); setPendingCancelId(booking.id); }}
                                    sx={{ borderRadius: 5, textTransform: "none" }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<EditOutlined />}
                                    disabled={!isEditable(booking)}
                                    onClick={(event) => { event.stopPropagation(); setEditorTarget(booking.id); }}
                                    sx={{ borderRadius: 5, textTransform: "none", px: 2 }}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </MainLayout>
    );
};

export default Bookings;
