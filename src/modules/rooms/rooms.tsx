import { Box, Card, CardContent, CardMedia, Chip, IconButton, Typography } from "@mui/material";
import { type ReactElement } from "react";
import useRoomsController from "./use-rooms-controller";
import MainLayout from "../../components/main-layout/main-layout";
import FilterDrawer from "../../components/filter-drawer/filter-drawer";
import { FilterAlt } from "@mui/icons-material";

const Rooms = (): ReactElement => {
    const {
        isLoading,
        error,
        isFilterOpen,
        setIsFilterOpen,
        filterFields,
        visibleRooms
    } = useRoomsController();

    return (
        <MainLayout
            headerTitle="Rooms"
            error={error}
            isLoading={isLoading}
            headerActions={
                <IconButton onClick={() => setIsFilterOpen(true)}>
                    <FilterAlt />
                </IconButton>
            }
        >
            <FilterDrawer
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                fields={filterFields}
            />

            <Box
                component="section"
                sx={{
                    p: 2,
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                }}
            >
                {!isLoading && !error && visibleRooms.map(room =>
                    <Card
                        component="article"
                        elevation={3}
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
                                {room.amenities.map((amenity) => (
                                    <Chip key={amenity} size="small" variant="outlined" label={amenity} />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </MainLayout>
    );
};

export default Rooms;
