import { Alert, Box, Card, CardContent, CardMedia, Chip, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import type { ReactElement } from "react";
import useRoomsController from "./use-rooms-controller";

const Rooms = (): ReactElement => {
    const {
        rooms,
        isLoading,
        error
    } = useRoomsController();

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="h3">Rooms</Typography>
            <Divider sx={{ mb: 2 }} />
            <Paper sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
                {isLoading ?
                    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box> :
                    <Box
                        component="section"
                        sx={{
                            p: 2,
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        }}
                    >
                        {!isLoading && !error && rooms.map(room =>
                            <Card
                                component="article"
                                key={room.id}
                                sx={{
                                    transition: "transform 150ms ease, box-shadow 150ms ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={room.photoUrl}
                                    title={`${room.roomType} room`}
                                />
                                <CardContent>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="h6">{room.name}</Typography>
                                        {room.condition === "maintenance" && (
                                            <Chip size="small" color="warning" label="Maintenance" />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {room.roomType} · seats {room.capacity} · floor {room.floor}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {room.description}
                                    </Typography>
                                    <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                        {room.amenities.map((a) => (
                                            <Chip key={a} size="small" variant="outlined" label={a} />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                }
            </Paper>
        </Box >
    );
};

export default Rooms;