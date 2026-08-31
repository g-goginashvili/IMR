import {
    Alert, Box, Button, CircularProgress,
    IconButton, Paper, Typography
} from "@mui/material";
import { type ReactElement, type ReactNode } from "react";
import { Add, FilterAlt } from "@mui/icons-material";

type MainLayoutProps = {
    headerTitle: string;
    error: string | null;
    isLoading: boolean;
    onFilterClick?: () => void;
    onAddButtonClick?: () => void;
    children: ReactNode;
};

const MainLayout = ({
    headerTitle,
    error,
    isLoading,
    onFilterClick,
    onAddButtonClick,
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
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center" }}>
                        {onAddButtonClick &&
                            <Button variant="contained" onClick={onAddButtonClick}>
                                <Add /> Add
                            </Button>
                        }
                        {onFilterClick &&
                            <IconButton onClick={onFilterClick}>
                                <FilterAlt />
                            </IconButton>
                        }
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