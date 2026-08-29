import { Box, Divider, Typography } from "@mui/material";
import type { ReactElement } from "react";

const Rooms = (): ReactElement => {
    return (
        <Box>
            <Typography variant="h3">Rooms</Typography>
            <Divider />
        </Box >
    );
};

export default Rooms;