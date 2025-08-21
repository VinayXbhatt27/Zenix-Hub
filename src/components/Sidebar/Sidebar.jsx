import {useState} from 'react'
import styles from './Sidebar.module.css'


export function Sidebar({ chats, activeChatId , onActiveChatIdChange, onNewChatCreate , activeChatMessages}) {
    const [isOpen, setIsOpen] = useState(false);

    function handleSidebarToggle() {
        setIsOpen(!isOpen);
    }

    function handleEscapeClick(event) {
        if (isOpen && event.key === 'Escape') {
            setIsOpen(false);
        }
    }
     function handleChatClick(chatId) {
        onActiveChatIdChange(chatId);
        if (isOpen){
            setIsOpen(false);
        }
     }

    return (
        <>
            <button 
                className={styles.MenuButton} 
                onClick={handleSidebarToggle} 
                onKeyDown={handleEscapeClick}
            >
                <MenuIcon />
            </button>

            <div className={styles.Sidebar} data-open={isOpen}>
               <button
                   className={styles.NewChatButton}
                   disabled={activeChatMessages.length === 0}
                   onClick={onNewChatCreate}
               >
                   New Chat
               </button>


                <ul className={styles.Chats}>
                    {chats
                        .filter(({messages}) => messages.length > 0)
                        .map((chat) => (
                            <li
                                key={chat.id}
                                className={styles.Chat}
                                data-active={chat.id === activeChatId}
                                onClick={() => handleChatClick(chat.id)}
                            >
                                <button className={styles.ChatButton}>
                                    <div className={styles.ChatTitle}>{chat.title}</div>
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
            {isOpen && <div className={styles.Overlay} onClick={handleSidebarToggle}/>}
        </>
    );
}

function MenuIcon(){
    return (
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        height="24px" 
        viewBox="0 -960 960 960" 
        width="24px" 
        fill="#FFFFFF"
        >
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
        </svg>
    )
}