import { useEffect, useState } from "react";
import type { Booking } from "../bookings/booking-types";
import { minutesIntoDay, todayLocal } from "../../utility/time-formatting";

export const DAY_START_HOUR = 7;
export const DAY_END_HOUR = 21;

export const HOUR_HEIGHT = 56;
export const MIN_COLUMN_WIDTH = 132;
export const GUTTER_WIDTH = 64;
export const MIN_BLOCK_HEIGHT = 20;
export const TIME_LINE_MIN_HEIGHT = 36;

export const GRID_HEIGHT = (DAY_END_HOUR - DAY_START_HOUR) * HOUR_HEIGHT;

const hours = Array.from(
    { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
    (_, index) => DAY_START_HOUR + index
);

const currentMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};

const useScheduleGridController = () => {
    const [nowMinutes, setNowMinutes] = useState(currentMinutes);

    useEffect(() => {
        const timer = setInterval(() => setNowMinutes(currentMinutes()), 60000);
        return () => clearInterval(timer);
    }, []);

    const offsetCalculator = (minutes: number) =>
        ((minutes - DAY_START_HOUR * 60) / 60) * HOUR_HEIGHT;

    const bookingGeometry = (booking: Booking) => {
        const top = Math.max(offsetCalculator(minutesIntoDay(booking.start)), 0);
        const bottom = Math.min(offsetCalculator(minutesIntoDay(booking.end)), GRID_HEIGHT);
        return { top, height: Math.max(bottom - top, MIN_BLOCK_HEIGHT) };
    };

    const today = todayLocal();
    const isNowVisible = nowMinutes >= DAY_START_HOUR * 60 && nowMinutes <= DAY_END_HOUR * 60;

    return {
        hours,
        nowMinutes,
        today,
        isNowVisible,
        offsetCalculator,
        bookingGeometry,
    };
};

export default useScheduleGridController;
