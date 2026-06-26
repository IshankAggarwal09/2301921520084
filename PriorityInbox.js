const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjc2FpMjMxMDZAZ2xiaXRtLmFjLmluIiwiZXhwIjoxNzgyNDU3MTA4LCJpYXQiOjE3ODI0NTYyMDgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI5MDgyNjg1Yi1iMGM3LTQ4NTYtYmFkYi0wNTVkODhmYzI2MTAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJpc2hhbmsgYWdnYXJ3YWwiLCJzdWIiOiIwMmZhYzc4NS0wYjk1LTQwZDMtYjkwMi01MWFhYmU0MDBiMzkifSwiZW1haWwiOiJjc2FpMjMxMDZAZ2xiaXRtLmFjLmluIiwibmFtZSI6ImlzaGFuayBhZ2dhcndhbCIsInJvbGxObyI6IjIzMDE5MjE1MjAwODQiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiIwMmZhYzc4NS0wYjk1LTQwZDMtYjkwMi01MWFhYmU0MDBiMzkiLCJjbGllbnRTZWNyZXQiOiJwSnJLeldUS3VEZGJoVlRTIn0.htOGik-9ejkfPon3-xNI8Hx-jhfE1aUCqISx5THsDQ4";

const TOP_N = 10;

const WEIGHTS = {
  Placement: 100,
  Result: 70,
  Event: 40,
};

async function fetchNotifications() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

function calculateScore(notification, latestTime) {
  const weight = WEIGHTS[notification.Type] || 10;

  const current = new Date(notification.Timestamp);
  const diffMinutes = (latestTime - current) / (1000 * 60);

  return weight - diffMinutes * 0.5;
}

function getTopNotifications(notifications, n = 10) {
  if (notifications.length === 0) return [];

  const latestTime = notifications.reduce((latest, item) => {
    const time = new Date(item.Timestamp);
    return time > latest ? time : latest;
  }, new Date(notifications[0].Timestamp));

  const scored = notifications.map((notification) => ({
    ...notification,
    score: calculateScore(notification, latestTime),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, n);
}

async function main() {
  try {
    const data = await fetchNotifications();

    const topNotifications = getTopNotifications(data.notifications, TOP_N);

    console.log("\n========== TOP 10 PRIORITY NOTIFICATIONS ==========\n");

    topNotifications.forEach((notification, index) => {
      console.log(`#${index + 1}`);
      console.log(`ID        : ${notification.ID}`);
      console.log(`Type      : ${notification.Type}`);
      console.log(`Message   : ${notification.Message}`);
      console.log(`Timestamp : ${notification.Timestamp}`);
      console.log(`Score     : ${notification.score.toFixed(2)}`);
      console.log("---------------------------------------------");
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();