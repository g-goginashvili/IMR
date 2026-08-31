import {
    Box, Button, Chip, Divider, IconButton, Modal, Paper, Typography
} from "@mui/material";
import { EditOutlined, CloseOutlined } from "@mui/icons-material";
import type { ReactElement } from "react";
import type { Booking } from "./booking-types";
import { formatDay, formatDuration, formatTime } from "../../utility/time-formatting";

const BookingDetailsModal = ({
    booking, onClose, onCancel, onEdit
}: {
    booking: Booking | null;
    onClose: () => void;
    onCancel: () => void;
    onEdit: () => void;
}): ReactElement => {
    return (
        <Modal
            open={!!booking}
            onClose={onClose}
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
                {booking && <>
                    <Box component="header" sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                                {booking.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {formatDay(booking.start)} · {formatTime(booking.start)}-{formatTime(booking.end)}
                            </Typography>
                        </Box>
                        <IconButton onClick={onClose}>
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
                                label={booking.status === "cancelled" ? "Cancelled" : "Confirmed"}
                                color={booking.status === "cancelled" ? "warning" : "success"}
                            />
                        </Box>

                        <Box component="dt">Room</Box>
                        <Box component="dd">{booking.room.name}</Box>

                        <Box component="dt">Duration</Box>
                        <Box component="dd">{formatDuration(booking.start, booking.end)}</Box>

                        <Box component="dt">Organizer</Box>
                        <Box component="dd">
                            {booking.organizer.name}
                            <Typography variant="caption" component="div" color="text.secondary">
                                {booking.organizer.email}
                            </Typography>
                        </Box>

                        {booking.description && <>
                            <Box component="dt">Description</Box>
                            <Box component="dd">{booking.description}</Box>
                        </>}
                    </Box>

                    <Divider sx={{ my: 2, borderStyle: "dashed" }} />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button
                            size="small"
                            color="error"
                            startIcon={<CloseOutlined />}
                            disabled={booking.status === "cancelled"}
                            onClick={onCancel}
                            sx={{ borderRadius: 5, textTransform: "none" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<EditOutlined />}
                            disabled={booking.status === "cancelled"}
                            onClick={onEdit}
                            sx={{ borderRadius: 5, textTransform: "none", px: 2 }}
                        >
                            Edit
                        </Button>
                    </Box>
                </>}
            </Paper>
        </Modal>
    );
};

export default BookingDetailsModal;
