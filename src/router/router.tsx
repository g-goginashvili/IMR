import { createBrowserRouter, Navigate } from "react-router";
import NavigationDrawer from "../modules/navigation-drawer/navigation-drawer";
import Dashboard from "../modules/dashboard/dashboard";
import Rooms from "../modules/rooms/rooms";
import Bookings from "../modules/bookings/bookings";

export const customRouter = createBrowserRouter([
  {
    path: "/",
    Component: NavigationDrawer,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: Dashboard },
      { path: "rooms", Component: Rooms },
      { path: "schedule", element: <div>Schedule</div> },
      { path: "bookings", Component: Bookings },
    ],
  },
]);