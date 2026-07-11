import ChatWidget from "./ChatWidget.js";

const script = [...document.querySelectorAll("script")].find((script) =>
  script.src.includes("loader.js")
);

new ChatWidget(script);