import {
    Alert, Box, CircularProgress, Divider,
    IconButton, Paper, Typography
} from "@mui/material";
import { type ReactElement, type ReactNode } from "react";
import { FilterAlt } from "@mui/icons-material";

type MainLayoutProps = {
    headerTitle: string;
    error: string | null;
    isLoading: boolean;
    onFilterClick?: () => void;
    children: ReactNode;
};

const MainLayout = ({
    headerTitle,
    error,
    isLoading,
    onFilterClick,
    children
}: MainLayoutProps): ReactElement => {

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Paper sx={{ mb: 2, borderRadius: 3 }} elevation={3}>
                <Box component="header"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2
                    }}
                >
                    <Typography variant="h3">{headerTitle}</Typography>
                    {onFilterClick && (
                        <IconButton onClick={onFilterClick}>
                            <FilterAlt />
                        </IconButton>
                    )}
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