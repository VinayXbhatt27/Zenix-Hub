import { useRef, useEffect, useMemo } from "react";
import Markdown from "react-markdown";
import styles from "./Messages.module.css";

const WELCOME_MESSAGE_GROUP = [
  {
    role: "assistant",
    content: `🚀 Booting up… Welcome aboard, traveler!
You’ve landed at Zenix Hub, your cheerful AI station where answers warp in at light speed`,
  },
];

export function Messages({ messages }) {
  const messagesEndRef = useRef(null);

  const messagesGroups = useMemo(
    () =>
      messages.reduce((groups, message) => {
        if (message.role === "user") groups.push([]);
        groups[groups.length - 1].push(message);
        return groups;
      }, []),
    [messages]
  );

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const renderMessageContent = (content) => {
    // Match markdown image syntax ![alt](url)
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const images = [];
    let textContent = content;

    let match;
    while ((match = imageRegex.exec(content)) !== null) {
      images.push(match[1]);
    }

    // Remove image markdown from text for separate rendering
    textContent = content.replace(imageRegex, "").trim();

    return (
      <>
        {images.length > 0 &&
          images.map((src, i) => (
            src ? (
              <img
                key={i}
                src={src}
                alt="Generated"
                className={styles.GeneratedImage}
              />
            ) : null
          ))}
        {textContent && <Markdown>{textContent}</Markdown>}
      </>
    );
  };

  return (
    <div className={styles.Messages}>
      {[WELCOME_MESSAGE_GROUP, ...messagesGroups].map(
        (messages, groupIndex) => (
          <div key={groupIndex} className={styles.Group}>
            {messages.map(({ role, content }, index) => (
              <div key={index} className={styles.Message} data-role={role}>
                <div className={styles.Markdown}>
                  {renderMessageContent(content)}
                </div>
              </div>
            ))}
          </div>
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
