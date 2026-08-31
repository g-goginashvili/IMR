import {
    Avatar, Box, Button, Card, CardContent, Chip, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Divider,
    IconButton, Modal, Paper, Typography
} from "@mui/material";
import { AccessTime, EditOutlined, CloseOutlined, PunchClock } from "@mui/icons-material";
import type { ReactElement } from "react";
import MainLayout from "../../components/main-layout/main-layout";
import useBookingsController from "./use-bookings-controller";

const formatDay = (iso: string) => new Date(iso).toLocaleDateString(undefined, {
    weekday: "short", day: "numeric", month: "short",
});

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit", minute: "2-digit",
});

const formatDuration = (start: string, end: string) => {
    const minutes = Math.round((Date.parse(end) - Date.parse(start)) / 60_000);
    const hours = Math.floor(minutes / 60);
    return [hours && `${hours}h`, minutes % 60 && `${minutes % 60}m`].filter(Boolean).join(" ");
};

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
    } = useBookingsController()

    return (
        <MainLayout
            headerTitle="Bookings"
            error={error}
            isLoading={isLoading}
        >
            <Dialog
                open={!!pendingCancel}
                onClose={() => setPendingCancelId(null)}
            >
                <DialogTitle>Cancel this booking?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {pendingCancel &&
                            <>
                                <strong>{pendingCancel.title}</strong> on {formatDay(pendingCancel.start)} at{" "}
                                {formatTime(pendingCancel.start)} will be cancelled and the room released.
                                This cannot be undone.
                            </>
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setPendingCancelId(null)}
                        disabled={isCancelling}
                        sx={{ borderRadius: 5, textTransform: "none" }}
                    >
                        Keep booking
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmCancel}
                        disabled={isCancelling}
                        sx={{ borderRadius: 5, textTransform: "none", px: 2 }}
                    >
                        {isCancelling ? "Cancelling…" : "Cancel booking"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Modal
                open={!!selectedBooking}
                onClose={() => setSelectedBookingId(null)}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Paper
                    component="article"
                    elevation={8}
                    sx={{
                        width: "min(520px, calc(100% - 32px))",
                        maxHeight: "calc(100% - 64px)",
                        overflowY: "auto",
                        p: 3,
                    }}
                >
                    {selectedBooking && <>
                        <Box component="header" sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                                    {selectedBooking.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDay(selectedBooking.start)} · {formatTime(selectedBooking.start)}-{formatTime(selectedBooking.end)}
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setSelectedBookingId(null)}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box
                            component="dl"
                            sx={{
                                m: 0,
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                rowGap: 1.5,
                                columnGap: 3,
                                "& dt": { color: "text.secondary", typography: "body2" },
                                "& dd": { m: 0, typography: "body2" },
                            }}
                        >
                            <Box component="dt">Status</Box>
                            <Box component="dd">
                                <Chip
                                    size="small"
                                    label={selectedBooking.status === "cancelled" ? "Cancelled" : "Confirmed"}
                                    color={selectedBooking.status === "cancelled" ? "warning" : "success"}
                                />
                            </Box>

                            <Box component="dt">Room</Box>
                            <Box component="dd">{selectedBooking.roomId}</Box>

                            <Box component="dt">Duration</Box>
                            <Box component="dd">{formatDuration(selectedBooking.start, selectedBooking.end)}</Box>

                            <Box component="dt">Organizer</Box>
                            <Box component="dd">
                                {selectedBooking.organizer.name}
                                <Typography variant="caption" component="div" color="text.secondary">
                                    {selectedBooking.organizer.email}
                                </Typography>
                            </Box>

                            {selectedBooking.description && <>
                                <Box component="dt">Description</Box>
                                <Box component="dd">{selectedBooking.description}</Box>
                            </>}
                        </Box>

                        <Divider sx={{ my: 2, borderStyle: "dashed" }} />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Button
                                size="small"
                                color="error"
                                startIcon={<CloseOutlined />}
                                disabled={selectedBooking.status === "cancelled"}
                                onClick={() => setPendingCancelId(selectedBooking.id)}
                                sx={{ borderRadius: 5, textTransform: "none" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<EditOutlined />}
                                disabled={selectedBooking.status === "cancelled"}
                                onClick={() => { }}
                                sx={{ borderRadius: 5, textTransform: "none", px: 2 }}
                            >
                                Edit
                            </Button>
                        </Box>
                    </>}
                </Paper>
            </Modal>
            <Box
                component="section"
                sx={{
                    p: 2,
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                }}
            >
                {!isLoading && !error && bookings.map(booking =>
                    <Card
                        component="article"
                        key={booking.id}
                        onClick={() => setSelectedBookingId(booking.id)}
                        sx={{
                            p: 1,
                            opacity: booking.status === "cancelled" ? 0.65 : 1,
                            transition: "transform 150ms ease, box-shadow 150ms ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 4,
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
                                        {booking.roomId}
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
                                    disabled={booking.status === "cancelled"}
                                    onClick={(event) => { event.stopPropagation(); setPendingCancelId(booking.id); }}
                                    sx={{ borderRadius: 5, textTransform: "none" }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<EditOutlined />}
                                    disabled={booking.status === "cancelled"}
                                    onClick={() => { }}
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
