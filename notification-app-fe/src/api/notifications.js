const BASE_URL = "http://4.224.186.213/evaluation-service/notifications";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjc2FpMjMxMDZAZ2xiaXRtLmFjLmluIiwiZXhwIjoxNzgyNDU5NjI2LCJpYXQiOjE3ODI0NTg3MjYsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyMGQzYTZkMS05Y2JlLTRjODEtOTg1My0yMzFlMWE3ODJiMGYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJpc2hhbmsgYWdnYXJ3YWwiLCJzdWIiOiIwMmZhYzc4NS0wYjk1LTQwZDMtYjkwMi01MWFhYmU0MDBiMzkifSwiZW1haWwiOiJjc2FpMjMxMDZAZ2xiaXRtLmFjLmluIiwibmFtZSI6ImlzaGFuayBhZ2dhcndhbCIsInJvbGxObyI6IjIzMDE5MjE1MjAwODQiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiIwMmZhYzc4NS0wYjk1LTQwZDMtYjkwMi01MWFhYmU0MDBiMzkiLCJjbGllbnRTZWNyZXQiOiJwSnJLeldUS3VEZGJoVlRTIn0.lnR2PXGlL27lU8GRYxb_uj7Mn-mVQAJDx_FZrpVvIZ8";

export async function fetchNotifications({
    page = 1,
    limit = 10,
    notificationType = ""
}) {

    const url = new URL(BASE_URL);

    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);

    if (notificationType)
        url.searchParams.append(
            "notification_type",
            notificationType
        );

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });

    if (!response.ok)
        throw new Error("Unable to fetch notifications");

    return await response.json();
}