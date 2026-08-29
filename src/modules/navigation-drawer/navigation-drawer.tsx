import {
    Dashboard,
    MeetingRoom,
    CalendarMonth,
    EventNote,
    Fence,
} from "@mui/icons-material";
import {
    Box,
    Divider, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar,
    Typography,
} from "@mui/material";
import { NavLink, Outlet } from "react-router";

const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: <Dashboard /> },
    { label: "Rooms", to: "/rooms", icon: <MeetingRoom /> },
    { label: "Schedule", to: "/schedule", icon: <CalendarMonth /> },
    { label: "Bookings", to: "/bookings", icon: <EventNote /> },
];

const NavigationDrawer = () => (
    <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
        <Drawer variant="permanent" anchor="left" sx={{
            width: 240, flexShrink: 0,
            "& .MuiDrawer-paper": { width: 240 }
        }}>
            <Toolbar
                disableGutters
                sx={{
                    padding: 2,
                    gap: 1
                }}
            >
                <Fence />
                <Typography variant="body2">Internal Meeting Rooms</Typography>
            </Toolbar>
            <Divider />
            <List>
                {navItems.map(({ label, to, icon }) => (
                    <ListItem key={to} disablePadding>
                        <ListItemButton
                            sx={{
                                "&.active": { bgcolor: "action.selected" }
                            }}
                            component={NavLink} to={to}
                        >
                            <ListItemIcon>{icon}</ListItemIcon>
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
                height: "100%",
                overflow: "auto",
                p: 2
            }}
        >
            <Outlet />
        </Box>
    </Box>
);

export default NavigationDrawer;