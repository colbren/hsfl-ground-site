import {
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const drawerWidth = 220;

export default function Sidebar() {
    const navigate = useNavigate();

    const { user } = useAuth();

    const clientPages = [
        {
            title: "Dashboard",
            path: "/",
        },
        {
            title: "Ground Stations",
            path: "/groundstations",
        },
        {
            title: "Scheduled Passes",
            path: "/scheduled-passes",
        }
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <Toolbar />

            <List>
                {clientPages.map((page) => (
                    <ListItemButton
                        key={page.path}
                        onClick={() =>
                            navigate(page.path)
                        }
                    >
                        <ListItemText
                            primary={page.title}
                        />
                    </ListItemButton>
                ))}
            </List>

            {user?.role ===
                "GroundStationNetwork" && (
                <>
                    <Divider />

                    <Typography
                        sx={{
                            p: 2,
                            fontWeight: "bold",
                        }}
                    >
                        Network
                    </Typography>

                    <List>
                        {networkPages.map(
                            (page) => (
                                <ListItemButton
                                    key={page.path}
                                    onClick={() =>
                                        navigate(
                                            page.path
                                        )
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            page.title
                                        }
                                    />
                                </ListItemButton>
                            )
                        )}
                    </List>
                </>
            )}
        </Drawer>
    );
}