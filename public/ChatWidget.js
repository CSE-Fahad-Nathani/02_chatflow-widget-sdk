import {
  createSession,
  sendMessage,
  getMessages,
  saveVisitor,
} from "./api.js";

import {
  createChatWindow,
  createButton,
  addMessage,
  renderMessages,
  showChatUI,
} from "./dom.js";

export default class ChatWidget {
  constructor(script) {
    this.script = script;

    this.config = {
      websiteId: this.script.dataset.websiteId,
    };

    this.isOpen = false;
    this.renderedMessageCount = 0;

    this.basePath = this.getBasePath();

    this.init();
  }

  async init() {
    console.log("Initializing Widget...");

    const savedSessionId =
      localStorage.getItem("chat_session_id") || "";

    this.session = await createSession(
      this.config.websiteId,
      savedSessionId
    );

    localStorage.setItem(
      "chat_session_id",
      this.session.sessionId
    );

    this.config.title = this.session.config.title;
    this.config.color = this.session.config.primaryColor;

    this.loadCSS();

    this.chatWindow = createChatWindow(
      this.config.title,
      this.session.sessionId,
      this.config.color,
      () => this.toggle()
    );

    this.button = createButton(this.config.color, () => this.toggle());

    // If email already exists, show chat immediately
    const savedEmail = localStorage.getItem("chat_email");

    if (savedEmail) {
      showChatUI();
      await this.loadMessages({ full: true });
    }


    this.attachEvents();
    this.startPolling();
  }

  attachEvents() {
    // Email
    const emailInput = document.getElementById("my-chat-email-input");
    const emailBtn = document.getElementById("my-chat-email-btn");

    emailBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
    
      if (!email) return;
    
      await saveVisitor(this.session.sessionId, email);
    
      localStorage.setItem("chat_email", email);
    
      showChatUI();
    
      await this.loadMessages({ full: true });
    });

    // Chat
    const input = document.getElementById("my-chat-input");
    const sendBtn = document.getElementById("my-chat-send");

    const submit = async () => {
      const message = input.value.trim();

      if (!message) return;

      addMessage(message, "visitor", {
        forceScroll: true,
      });

      this.renderedMessageCount++;

      const response = await sendMessage(
        this.session.sessionId,
        message
      );

      console.log("Message Response:", response);

      input.value = "";
    };

    input.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter") return;

      await submit();
    });

    sendBtn.addEventListener("click", submit);
  }

  async loadMessages({ full = false } = {}) {
    const response = await getMessages(this.session.sessionId);

    const allMessages = response.messages;

    if (
      full ||
      allMessages.length < this.renderedMessageCount
    ) {
      renderMessages(allMessages);
    } else {
      const newMessages = allMessages.slice(
        this.renderedMessageCount
      );

      newMessages.forEach((item) =>
        addMessage(item.message, item.sender)
      );
    }

    this.renderedMessageCount = allMessages.length;
  }

  startPolling() {
    setInterval(async () => {
      if (!this.isOpen) return;

      await this.loadMessages();
    }, 2000);
  }

  getBasePath() {
    return this.script.src.substring(
      0,
      this.script.src.lastIndexOf("/") + 1
    );
  }

  loadCSS() {
    const css = document.createElement("link");

    css.rel = "stylesheet";
    css.href = this.basePath + "widget.css";

    document.head.appendChild(css);
  }

  async toggle() {
    this.isOpen = !this.isOpen;

    this.chatWindow.classList.toggle(
      "my-chat-open",
      this.isOpen
    );

    if (this.isOpen) {
      await this.loadMessages({
        full: true,
      });
    }
  }
}