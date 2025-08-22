import { useEffect, useMemo, useState, useRef } from "react";
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
  const [user, setUser] = useState(null); // Firebase user
  const [menuOpen, setMenuOpen] = useState(false); // dropdown toggle
  const menuRef = useRef(null);

  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && chats.length === 0) {
        handleNewChatCreate();
      }
    });
    return () => unsubscribe();
  }, [chats.length]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Assistant selection
  function handleAssistantChange(newAssistant) {
    setAssistant(newAssistant);
  }

  // Update messages in a chat
  function handleChatMessagesUpdate(id, messages) {
    const title =
      messages[0]?.content.split(" ").slice(0, 5).join(" ") || "New Chat";
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, title: chat.title ?? title, messages } : chat
      )
    );
  }

  // Create a new chat
  function handleNewChatCreate() {
    const id = uuidv4();
    setActiveChatId(id);
    setChats((prevChats) => [...prevChats, { id, messages: [] }]);
  }

  // Change active chat
  function handleActiveChatIdChange(id) {
    setActiveChatId(id);
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setChats([]);
      setActiveChatId(null);
      setAssistant(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return <HeroPage />;
  }

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        {/* Centered logo + title */}
        <div className={styles.HeaderCenter}>
          <img className={styles.Logo} src="/chat-bot.png" alt="logo" />
          <h2 className={styles.Title}>ZENIX HUB</h2>
        </div>

        {/* User Dropdown top-right */}
        <div className={styles.UserMenu} ref={menuRef}>
          <div className={styles.UserBox}>
            <button
              className={styles.UserButton}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
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
            </button>
          </div>

          {menuOpen && (
            <div className={styles.DropdownMenu}>
              <span className={styles.UserName}>{user.displayName || "User"}</span>
              <button className={styles.LogoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className={styles.Content}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onActiveChatIdChange={handleActiveChatIdChange}
          onNewChatCreate={handleNewChatCreate}
          activeChatMessages={activeChatMessages}
          user={user}
          onLogout={handleLogout}
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
