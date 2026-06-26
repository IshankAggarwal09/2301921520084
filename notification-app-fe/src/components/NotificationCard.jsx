import {
    Card,
    CardContent,
    Typography,
    Chip
} from "@mui/material";

export default function NotificationCard({
    notification,
    onClick
}) {

    const color = {
        Placement: "error",
        Result: "primary",
        Event: "success"
    };

    return (

        <Card
            sx={{
                mb:2,
                cursor:"pointer",
                transition:"0.2s",

                "&:hover":{
                    boxShadow:5
                },

                bgcolor: notification.read
                    ? "#fff"
                    : "#e3f2fd"
            }}

            onClick={onClick}
        >

            <CardContent>

                <Typography variant="h6">

                    {notification.Message}

                </Typography>

                <Chip

                    label={notification.Type}

                    color={
                        color[notification.Type]
                    }

                    sx={{
                        mt:1
                    }}

                />

                <Typography
                    mt={2}
                    color="text.secondary"
                >

                    {notification.Timestamp}

                </Typography>

            </CardContent>

        </Card>

    );

}