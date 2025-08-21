import { useState, useEffect } from 'react';
import {Messages} from '../Messages/Messages.jsx'
import {Loader} from '../Loader/Loader.jsx' 
import {Controls} from '../Controls/Controls.jsx'  
import styles from './Chat.module.css'


export function Chat({
  assistant,
  isActive = false,
  chatId,
  chatMessages,
  onChatMessagesUpdate
}) {
    const [messages,setMessages]=useState([]);
    const [isLoading, setIsLoading] = useState(false); // State to manage loading status
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
      setMessages(chatMessages);
    }, [chatId]);

    useEffect(() => {
      onChatMessagesUpdate(chatId, messages);
    }, [messages]);

    function updateLastMessageContent(content) {
      setMessages((prevMessages) =>
        prevMessages.map((message, index) =>
            index === prevMessages.length - 1
              ? { ...message, content: `${message.content}${content}` }
              : message
          )
        );
      }
    
      function addMessage(message) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    
      async function handleContentSend(content) {
        addMessage({ content, role: "user" });
        setIsLoading(true);
        try {
          const result = await assistant.chatStream(
            content,
            messages.filter(({ role }) => role !== "system")
          );
    
          let isFirstChunk = false;
          for await (const chunk of result) {
            if (!isFirstChunk) {
              isFirstChunk = true;
              addMessage({ content: "", role: "assistant" });
              setIsLoading(false);
              setIsStreaming(true);
            }
    
            updateLastMessageContent(chunk);
          }

          setIsStreaming(false);
        } catch (error) {
          addMessage({
            content:
              error?.message ??
              "Sorry, I couldn't process your request. Please try again!",
            role: "system",
          });
          setIsLoading(false);
          setIsStreaming(false);
        }
      }

      if(!isActive){
        return null;
      }
    
    return(
        <>
        {isLoading && <Loader />}

        <div className={styles.Chat}>  {/* div for chat container */}
            <Messages messages={messages}  />     {/* rendering chat component */}
        </div>
        <Controls  
            isDisabled={isLoading || isStreaming} 
            onSend={handleContentSend}/>          {/* rendering controls component and handling user input by sending it to the chat */}
        </>
    )
}