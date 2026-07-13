const BASE_URL = "https://zero1-chatflow-backend.onrender.com";

export async function createSession(websiteId, sessionId = "") {
  const response = await fetch(
    `${BASE_URL}/session?websiteId=${websiteId}&sessionId=${sessionId}`
  );

  return response.json();
}

export async function sendMessage(sessionId, message) {
  const response = await fetch(`${BASE_URL}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      message,
    }),
  });

  return response.json();
}

export async function getMessages(sessionId) {
  const response = await fetch(
    `${BASE_URL}/messages?sessionId=${sessionId}`
  );

  return response.json();
}

export async function saveVisitor(sessionId, email) {
  const response = await fetch(`${BASE_URL}/visitor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      email,
    }),
  });

  return response.json();
}