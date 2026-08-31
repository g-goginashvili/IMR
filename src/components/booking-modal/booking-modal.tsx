import { type ReactElement } from "react";
import {
    Alert, Box, Button, CircularProgress, MenuItem,
    Modal, Paper, Stack, TextField, Typography
} from "@mui/material";
import type { Booking } from "../../modules/bookings/booking-types";
import useBookingModalController, {
    type BookingBodyType
} from "./use-booking-modal-controller";

const BookingModal = ({
    isOpen, onClose, onSubmit, bookings, booking
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (body: BookingBodyType) => Promise<void>;
    bookings: Booking[];
    booking?: Booking;
}): ReactElement => {
    const {
        formik,
        isLoadingRooms,
        submitError,
        selectableRooms
    } = useBookingModalController({ onClose, onSubmit, bookings, booking });

    return (
        <Modal
            open={isOpen}
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
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {booking ? "Edit booking" : "New booking"}
                </Typography>

                {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

                <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            name="title"
                            label="Title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && !!formik.errors.title}
                            helperText={formik.touched.title && formik.errors.title}
                        />

                        <TextField
                            select
                            fullWidth
                            name="roomId"
                            label="Room"
                            disabled={isLoadingRooms}
                            value={isLoadingRooms ? "" : formik.values.roomId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.roomId && !!formik.errors.roomId}
                            helperText={formik.touched.roomId && formik.errors.roomId}
                            slotProps={{
                                input: {
                                    startAdornment: isLoadingRooms
                                        ? <CircularProgress size={18} sx={{ mr: 1 }} />
                                        : undefined,
                                },
                            }}
                        >
                            {selectableRooms.map(room => (
                                <MenuItem key={room.id} value={room.id}>
                                    {room.name} · seats {room.capacity} · floor {room.floor}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            type="date"
                            name="date"
                            label="Date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.date && !!formik.errors.date}
                            helperText={formik.touched.date && formik.errors.date}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                fullWidth
                                type="time"
                                name="startTime"
                                label="Start"
                                value={formik.values.startTime}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.startTime && !!formik.errors.startTime}
                                helperText={formik.touched.startTime && formik.errors.startTime}
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                            <TextField
                                fullWidth
                                type="time"
                                name="endTime"
                                label="End"
                                value={formik.values.endTime}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.endTime && !!formik.errors.endTime}
                                helperText={formik.touched.endTime && formik.errors.endTime}
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            name="organizerName"
                            label="Organizer"
                            value={formik.values.organizerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.organizerName && !!formik.errors.organizerName}
                            helperText={formik.touched.organizerName && formik.errors.organizerName}
                        />

                        <TextField
                            fullWidth
                            name="organizerEmail"
                            label="Organizer email"
                            value={formik.values.organizerEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.organizerEmail && !!formik.errors.organizerEmail}
                            helperText={formik.touched.organizerEmail && formik.errors.organizerEmail}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            name="description"
                            label="Description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Button onClick={onClose} disabled={formik.isSubmitting}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={formik.isSubmitting || isLoadingRooms}
                            >
                                {booking ? "Save changes" : "Create booking"}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Modal>
    );
};

export default BookingModal;
