import { Box, Typography, useTheme } from "@mui/material";
import type { ReactElement } from "react";
import type { ScheduleColumn } from "./schedule-types";
import { formatTime, toTimeOfDay } from "../../utility/time-formatting";
import { isPast } from "../../utility/booking-rules";
import useScheduleGridController, {
    GRID_HEIGHT, GUTTER_WIDTH, HOUR_HEIGHT, MIN_COLUMN_WIDTH, TIME_LINE_MIN_HEIGHT
} from "./use-schedule-grid-controller";

const ScheduleGrid = ({ columns, onBookingClick, onSlotClick }: {
    columns: ScheduleColumn[];
    onBookingClick: (id: string) => void;
    onSlotClick: (column: ScheduleColumn, startMinutes: number) => void;
}): ReactElement => {
    const theme = useTheme();
    const {
        hours,
        nowMinutes,
        today,
        isNowVisible,
        offsetCalculator,
        bookingGeometry,
        slotMinutesAt,
    } = useScheduleGridController();

    return (
        <Box sx={{ height: "100%", overflow: "auto" }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns:
                        `${GUTTER_WIDTH}px repeat(${columns.length}, minmax(${MIN_COLUMN_WIDTH}px, 1fr))`,
                    minWidth: "fit-content",
                }}
            >
                <Box sx={{
                    position: "sticky", top: 0, left: 0, zIndex: 4,
                    bgcolor: "background.paper",
                    borderBottom: 1, borderColor: "divider",
                }} />

                {columns.map(column => (
                    <Box
                        key={`header-${column.date}-${column.roomId}`}
                        sx={{
                            position: "sticky", top: 0, zIndex: 4,
                            bgcolor: "background.paper",
                            borderBottom: 1, borderLeft: 1, borderColor: "divider",
                            px: 1, py: 1.25, textAlign: "center",
                        }}
                    >
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                            {column.label}
                        </Typography>
                        {column.sublabel && (
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {column.sublabel}
                            </Typography>
                        )}
                    </Box>
                ))}

                <Box sx={{
                    position: "sticky", left: 0, zIndex: 3,
                    height: GRID_HEIGHT, mt: 1,
                    bgcolor: "background.paper",
                }}>
                    {hours.map(hour => (
                        <Typography
                            key={hour}
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                position: "absolute",
                                top: offsetCalculator(hour * 60),
                                right: 8,
                                transform: "translateY(-50%)",
                            }}
                        >
                            {toTimeOfDay(hour * 60)}
                        </Typography>
                    ))}
                </Box>

                {columns.map(column => (
                    <Box
                        key={`body-${column.date}-${column.roomId}`}
                        onClick={event => onSlotClick(column, slotMinutesAt(event))}
                        sx={{
                            position: "relative",
                            height: GRID_HEIGHT,
                            mt: 1,
                            borderLeft: 1,
                            borderColor: "divider",
                            cursor: column.date < today ? "default" : "copy",
                            backgroundImage: `repeating-linear-gradient(
                                to bottom,
                                ${theme.palette.divider} 0 1px,
                                transparent 1px ${HOUR_HEIGHT}px
                            )`,
                        }}
                    >
                        {isNowVisible && column.date === today && (
                            <Box sx={{
                                position: "absolute",
                                top: offsetCalculator(nowMinutes),
                                left: 0,
                                right: 0,
                                zIndex: 1,
                                borderTop: 2,
                                borderColor: "error.main",
                                pointerEvents: "none",
                            }} />
                        )}

                        {column.bookings.map(booking => {
                            const { top, height } = bookingGeometry(booking);
                            const past = isPast(booking);

                            return (
                                <Box
                                    key={booking.id}
                                    onClick={event => {
                                        event.stopPropagation();
                                        onBookingClick(booking.id);
                                    }}
                                    sx={{
                                        position: "absolute",
                                        top,
                                        height,
                                        left: 3,
                                        right: 3,
                                        zIndex: 2,
                                        overflow: "hidden",
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 1.5,
                                        borderLeft: 3,
                                        borderColor: "primary.dark",
                                        bgcolor: "primary.light",
                                        color: "primary.contrastText",
                                        opacity: past ? 0.55 : 1,
                                        cursor: "pointer",
                                        transition: "filter 150ms ease, box-shadow 150ms ease",
                                        "&:hover": { filter: "brightness(1.08)", boxShadow: 4 },
                                    }}
                                >
                                    <Typography variant="caption" noWrap
                                        sx={{ display: "block", fontWeight: 700, lineHeight: 1.3 }}>
                                        {booking.title}
                                    </Typography>
                                    {height >= TIME_LINE_MIN_HEIGHT && (
                                        <Typography variant="caption" noWrap
                                            sx={{ display: "block", lineHeight: 1.3, opacity: 0.9 }}>
                                            {formatTime(booking.start)}-{formatTime(booking.end)}
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ScheduleGrid;
