import {
    Avatar, Box, Card, CardContent, Chip, Divider,
    LinearProgress, List, ListItem, ListItemAvatar, ListItemText, Typography
} from "@mui/material";
import {
    AccessTime, Construction, EventAvailable, MeetingRoom, PunchClock, TrendingUp
} from "@mui/icons-material";
import type { ReactElement, ReactNode } from "react";
import MainLayout from "../../components/main-layout/main-layout";
import useDashboardController from "./use-dashboard-controller";
import { formatDuration, formatTime } from "../../utility/time-formatting";

type SectionCardProps = {
    title: string;
    flair?: ReactNode;
    children: ReactNode;
};

const SectionCard = ({ title, flair, children }: SectionCardProps): ReactElement => (
    <Card component="section" elevation={3} sx={{ height: "100%", borderRadius: 3 }}>
        <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
                {flair}
            </Box>
            <Divider sx={{ my: 1.5 }} />
            {children}
        </CardContent>
    </Card>
);

const EmptyState = ({ message }: { message: string }): ReactElement => (
    <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
        {message}
    </Typography>
);

const Dashboard = (): ReactElement => {
    const {
        isLoading,
        error,
        stats,
        ongoingBookings,
        utilisation
    } = useDashboardController();

    const statCards = [
        {
            label: "Rooms available now",
            value: stats.availableRooms,
            caption: `of ${stats.totalRooms} rooms`,
            icon: <MeetingRoom />,
            color: "success.main",
        },
        {
            label: "Bookings today",
            value: stats.bookingsToday,
            caption: `${stats.upcomingToday} upcoming`,
            icon: <EventAvailable />,
            color: "primary.main",
        },
        {
            label: "In progress",
            value: stats.ongoing,
            caption: "meetings running",
            icon: <PunchClock />,
            color: "info.main",
        },
        {
            label: "Under maintenance",
            value: stats.maintenanceRooms,
            caption: "rooms unavailable",
            icon: <Construction />,
            color: "warning.main",
        },
    ];

    return (
        <MainLayout headerTitle="Dashboard" error={error} isLoading={isLoading}>
            <Box component="section" sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>

                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    }}
                >
                    {statCards.map(stat =>
                        <Card
                            component="article"
                            elevation={3}
                            key={stat.label}
                            sx={{
                                borderRadius: 3,
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                                    {stat.icon}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {stat.caption}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
                        alignItems: "start",
                    }}
                >
                    <SectionCard
                        title="Currently ongoing"
                        flair={<Chip size="small" color="info" label="Live" />}
                    >
                        {ongoingBookings.length === 0 ?
                            <EmptyState message="No meetings are running right now." /> :
                            <List disablePadding>
                                {ongoingBookings.map(booking =>
                                    <ListItem key={booking.id} disableGutters divider>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                                <PunchClock />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={booking.title}
                                            secondary={`${booking.organizer.name} · ${booking.room.name}`}
                                            slotProps={{
                                                primary: { noWrap: true },
                                                secondary: { noWrap: true },
                                            }}
                                        />
                                        <Box sx={{ textAlign: "right", pl: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {formatTime(booking.start)} - {formatTime(booking.end)}
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                                                <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDuration(booking.start, booking.end)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                )}
                            </List>
                        }
                    </SectionCard>

                    <SectionCard
                        title="Utilisation by room"
                        flair={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <TrendingUp sx={{ fontSize: 18, color: "text.secondary" }} />
                                <Typography variant="caption" color="text.secondary">
                                    This week
                                </Typography>
                            </Box>
                        }
                    >
                        {utilisation.length === 0 ?
                            <EmptyState message="No rooms to report on." /> :
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {utilisation.map(room =>
                                    <Box key={room.id}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
                                            <Typography variant="body2" noWrap>{room.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {room.percentage} %
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={room.percentage}
                                            sx={{ height: 8, borderRadius: 5 }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        }
                    </SectionCard>
                </Box>

            </Box>
        </MainLayout>
    );
};

export default Dashboard;
