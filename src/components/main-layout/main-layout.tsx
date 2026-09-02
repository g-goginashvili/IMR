import {
    Alert, Box, CircularProgress, Paper, Typography
} from "@mui/material";
import { type ReactElement, type ReactNode } from "react";

type MainLayoutProps = {
    headerTitle: string;
    error: string | null;
    isLoading: boolean;
    headerActions?: ReactNode;
    children: ReactNode;
};

const MainLayout = ({
    headerTitle,
    error,
    isLoading,
    headerActions,
    children
}: MainLayoutProps): ReactElement => {

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Paper sx={{ mb: 2, borderRadius: 3 }} elevation={3}>
                <Box component="header"
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        p: 2
                    }}
                >
                    <Typography sx={{ typography: { xs: "h5", sm: "h3" } }}>
                        {headerTitle}
                    </Typography>
                    <Box sx={{
                        display: "flex", flexWrap: "wrap", gap: 2,
                        justifyContent: "center", alignItems: "center"
                    }}>
                        {headerActions}
                    </Box>

                </Box>
            </Paper>
            <Paper sx={{ flex: 1, minHeight: 0, overflowY: "auto", borderRadius: 3 }} elevation={3}>
                {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
                {isLoading ?
                    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box> :
                    children
                }
            </Paper>
        </Box >
    );
};

export default MainLayout;