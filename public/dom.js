function getScrollBody() {
  return document.getElementById("my-chat-body");
}

function isNearBottom(threshold = 40) {
  const body = getScrollBody();
  if (!body) return true;
  return body.scrollHeight - body.scrollTop - body.clientHeight < threshold;
}

function scrollToBottom() {
  const body = getScrollBody();
  if (body) body.scrollTop = body.scrollHeight;
}

export function createChatWindow(title, sessionId, color, onClose) {
  const chatWindow = document.createElement("div");

  chatWindow.id = "my-chat-window";
  chatWindow.style.setProperty("--accent", color);

  chatWindow.innerHTML = `
    <div id="my-chat-header">
      <div id="my-chat-header-info">
        <span id="my-chat-status-dot"></span>
        <span id="my-chat-title">${title}</span>
      </div>
      <button id="my-chat-close" type="button" aria-label="Close chat">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div id="my-chat-body">
      <div id="messages"></div>
    </div>

    <div id="my-chat-footer">
      <input
        id="my-chat-input"
        placeholder="Type a message..."
        autocomplete="off"
      />
      <button id="my-chat-send" type="button" aria-label="Send message">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M1.5 8L14.5 1.5L9.5 14.5L7.5 9L1.5 8Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(chatWindow);

  const closeBtn = document.getElementById("my-chat-close");
  if (closeBtn && typeof onClose === "function") {
    closeBtn.onclick = onClose;
  }

  return chatWindow;
}

export function createButton(color, onClick) {
  const button = document.createElement("button");

  button.id = "my-chat-widget-button";
  button.style.setProperty("--accent", color);
  button.setAttribute("aria-label", "Open chat");
  button.type = "button";

  button.innerHTML = `
    <span id="my-chat-widget-pulse"></span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H9L5 20.5V17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" fill="currentColor"/>
    </svg>
  `;

  button.onclick = onClick;

  document.body.appendChild(button);

  return button;
}

export function clearMessages() {
  document.getElementById("messages").innerHTML = "";
}

export function addMessage(message, sender = "visitor", { forceScroll = false } = {}) {
  const messages = document.getElementById("messages");
  const shouldStick = forceScroll || isNearBottom();

  const row = document.createElement("div");
  row.className = `my-chat-row my-chat-row-${sender}`;

  const bubble = document.createElement("div");
  bubble.className = `my-chat-bubble my-chat-bubble-${sender}`;
  bubble.textContent = message;

  row.appendChild(bubble);
  messages.appendChild(row);

  if (shouldStick) scrollToBottom();
}

export function renderMessages(messages) {
  clearMessages();

  messages.forEach((item) => {
    addMessage(item.message, item.sender);
  });

  // Always land on the latest message after a full (re)render
  scrollToBottom();
}