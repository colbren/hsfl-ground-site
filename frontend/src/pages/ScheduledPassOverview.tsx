import { useEffect, useState } from "react";

import axios from "axios";

import {
    Box,
    Paper,
    Typography,
    LinearProgress,
    Chip,
    Divider,
    Grid,
} from "@mui/material";


type ScheduledPass = {
    id: number;
    satellite_name: string;
    ground_station_name: string;
    start_time: string;
    end_time: string;
    status: string;
};


function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}


function PassCard({ pass }: { pass: ScheduledPass }) {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("");

    useEffect(() => {
        function update() {
            const now = new Date();
            const start = new Date(pass.start_time);
            const end = new Date(pass.end_time);
            const total = end.getTime() - start.getTime();
            const elapsed = now.getTime() - start.getTime();
            const pct = Math.max(0, Math.min(100, (elapsed / total) * 100));

            setProgress(pct);

            if (now < start) {
                setStatusText(
                    `${formatTime(start.getTime() - now.getTime())} until AOS`
                );
            }

            else if (now > end) {
                setStatusText("Pass Complete");
                setProgress(100);
            }

            else {
                setStatusText(
                    `${formatTime(end.getTime() - now.getTime())} remaining`
                );
            }
        }

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [pass]);


    const durationMinutes = (
        (new Date(pass.end_time).getTime() -new Date(pass.start_time).getTime()) / 60000).toFixed(1);

    return (
        <Paper sx={{ p: 3, height: "100%" }} elevation={3}>
            <Typography variant="h6">
                {pass.ground_station_name}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                {pass.satellite_name}
            </Typography>

            <Chip
                label={pass.status}
                color="primary"
                size="small"
                sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2">
                <strong>Start:</strong>{" "}
                {new Date(pass.start_time).toLocaleString()}
            </Typography>

            <Typography variant="body2">
                <strong>End:</strong>{" "}
                {new Date(pass.end_time).toLocaleString()}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Duration:</strong> {durationMinutes} min
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
                {statusText}
            </Typography>

            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 10,
                    borderRadius: 2,
                    mt: 2,
                }}
            />

            <Typography align="right" sx={{ mt: 1 }}>
                {progress.toFixed(0)}%
            </Typography>
        </Paper>
    );
}

export default function ScheduledPassOverview() {
    const [passes, setPasses] = useState<ScheduledPass[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get(
                "http://192.168.150.104:8001/api/scheduled-passes/"
            )
            .then((res) => {
                setPasses(res.data);
            })

            .catch((err) => {
                console.error("Failed to load passes:", err);
            })

            .finally(() => {
                setLoading(false);
            });

    }, []);


    if (loading) {

        return (
            <Typography p={3}>
                Loading scheduled passes...
            </Typography>
        );

    }


    if (!passes.length) {
        return (
            <Typography p={3}>
                No scheduled passes found.
            </Typography>
        );

    }


    return (
        <Box p={3}>
            <Typography variant="h4" mb={3}>
                Current Scheduled Passes
            </Typography>

            <Grid container spacing={3}>
                {passes.map((pass) => (
                    <Grid
                        key={pass.id}
                        size={{ xs: 12, md: 6, lg: 4 }}
                    >
                        <PassCard pass={pass} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

}