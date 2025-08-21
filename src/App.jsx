import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "./components/Sidebar/Sidebar.jsx";
import styles from "./App.module.css";
import { Assistants } from "./components/Assistants/Assistants.jsx";
import { Theme } from "./components/Theme/Theme.jsx";
import { Chat } from "./components/Chat/Chat.jsx";
import { v4 as uuidv4 } from "uuid";
import HeroPage from "./components/HeroPage/HeroPage.jsx";

// Firebase imports
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [assistant, setAssistant] = useState();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState();
  const [user, setUser] = useState(null); // Track Firebase user

  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // ✅ Only create a new chat if logged in AND no chats exist
      if (firebaseUser && chats.length === 0) {
        handleNewChatCreate();
      }
    });

    return () => unsubscribe();
  }, [chats.length]);

  function handleAssistantChange(newAssistant) {
    setAssistant(newAssistant);
  }

  function handleChatMessagesUpdate(id, messages) {
    const title = messages[0]?.content.split(" ").slice(0, 5).join(" ");
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id
          ? { ...chat, title: chat.title ?? title, messages }
          : chat
      )
    );
  }

  function handleNewChatCreate() {
    const id = uuidv4();
    setActiveChatId(id);
    setChats((prevChats) => [...prevChats, { id, messages: [] }]);
  }

  function handleActiveChatIdChange(id) {
    setActiveChatId(id);
    // Keep only chats that have messages
    setChats((prevChats) => prevChats.filter(({ messages }) => messages.length > 0));
  }

  // 🔑 If user not logged in → show HeroPage
  if (!user) {
    return <HeroPage />;
  }

  // 🔑 If logged in → show chat app
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" alt="logo" />
        <h2 className={styles.Title}>ZENIX HUB</h2>

        {/* ✅ User Info top-right */}
        <div className={styles.UserInfo}>
          <div className={styles.UserProfile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={styles.UserIcon}
            >
              <circle cx="12" cy="8" r="4" className={styles.UserIconFill} />
              <path
                d="M4 20c0-4 4-6 8-6s8 2 8 6"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                className={styles.UserIconStroke}
              />
            </svg>
            <span className={styles.UserName}>{user.displayName}</span>
          </div>
          <button className={styles.LogoutButton} onClick={() => signOut(auth)}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.Content}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onActiveChatIdChange={handleActiveChatIdChange}
          onNewChatCreate={handleNewChatCreate}
          activeChatMessages={activeChatMessages}
        />

        <main className={styles.Main}>
          {chats.map((chat) => (
            <Chat
              key={chat.id}
              assistant={assistant}
              isActive={chat.id === activeChatId}
              chatId={chat.id}
              chatMessages={chat.messages}
              onChatMessagesUpdate={handleChatMessagesUpdate}
            />
          ))}

          <div className={styles.Configuration}>
            <Assistants onAssistantChange={handleAssistantChange} />
            <Theme />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
