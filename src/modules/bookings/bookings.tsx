import {
    Avatar, Box, Button, Card, CardContent, Chip, Divider, Modal, Typography
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
        detailsModalState,
        setDetailsModalState,
    } = useBookingsController()

    return (
        <MainLayout
            headerTitle="Bookings"
            error={error}
            isLoading={isLoading}
        >
            <Modal
                open={detailsModalState}
                onClose={() => setDetailsModalState(false)}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Box></Box>
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
                        onClick={() => setDetailsModalState(true)}
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
                                    onClick={() => { }}
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
