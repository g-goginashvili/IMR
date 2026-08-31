import {
    Dashboard,
    MeetingRoom,
    CalendarMonth,
    EventNote,
    Fence,
    Menu,
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    Divider, Drawer, IconButton, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";

const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: <Dashboard /> },
    { label: "Rooms", to: "/rooms", icon: <MeetingRoom /> },
    { label: "Schedule", to: "/schedule", icon: <CalendarMonth /> },
    { label: "Bookings", to: "/bookings", icon: <EventNote /> },
];

const NavigationDrawer = () => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const [isOpen, setOpen] = useState(false);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isSmall ? "column" : "row",
                height: "100dvh",
                overflow: "hidden",
                bgcolor: "grey.300"
            }}
        >
            {isSmall && (
                <AppBar
                    position="static"
                    sx={{ zIndex: theme.zIndex.drawer + 1 }}
                >
                    <Toolbar
                        disableGutters
                        sx={{
                            padding: 2,
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Fence />
                            <Typography variant="body2">Internal Meeting Rooms</Typography>
                        </Box>
                        <IconButton onClick={() => setOpen(prev => !prev)} size="small">
                            <Menu />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}
            <Drawer
                variant={isSmall ? "temporary" : "permanent"}
                anchor={isSmall ? "top" : "left"}
                open={isOpen}
                onClose={() => setOpen(false)}
                sx={{
                    width: isSmall ? "100%" : 240,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: isSmall ? "100%" : 240,
                        boxSizing: "border-box",
                        bgcolor: "grey.800",
                        color: "grey.100"
                    },
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        padding: 2,
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Fence />
                        <Typography variant="body2">Internal Meeting Rooms</Typography>
                    </Box>
                </Toolbar>
                <Divider sx={{ bgcolor: "grey.100" }} />
                <List>
                    {navItems.map(({ label, to, icon }) => (
                        <ListItem key={to} disablePadding>
                            <ListItemButton
                                sx={{
                                    "&.active": { bgcolor: "primary.main" }
                                }}
                                component={NavLink} to={to}
                                onClick={() => setOpen(false)}
                            >
                                <ListItemIcon sx={{ color: "grey.100" }}>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    minHeight: 0,
                    overflow: "auto",
                    p: 2
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default NavigationDrawer;