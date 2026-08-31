import {
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import type { ReactElement } from "react";
import type { Booking } from "./booking-types";
import { formatDay, formatTime } from "../../utility/time-formatting";

const BookingCancelDialog = ({
    booking, isCancelling, onClose, onConfirm
}: {
    booking: Booking | null;
    isCancelling: boolean;
    onClose: () => void;
    onConfirm: () => void;
}): ReactElement => {
    return (
        <Dialog
            open={!!booking}
            onClose={onClose}
        >
            <DialogTitle>Cancel this booking?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {booking &&
                        <>
                            <strong>{booking.title}</strong> on {formatDay(booking.start)} at{" "}
                            {formatTime(booking.start)} will be cancelled and the room released.
                            This cannot be undone.
                        </>
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    disabled={isCancelling}
                    sx={{ borderRadius: 5, textTransform: "none" }}
                >
                    Keep booking
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={isCancelling}
                    sx={{ borderRadius: 5, textTransform: "none", px: 2 }}
                >
                    {isCancelling ? "Cancelling…" : "Cancel booking"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingCancelDialog;
