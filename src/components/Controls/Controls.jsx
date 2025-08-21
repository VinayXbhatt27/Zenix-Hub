import TextAreaAutosize from 'react-textarea-autosize' // Importing TextAreaAutosize for auto-resizing textarea
import styles from './Controls.module.css'
import { useState,useRef,useEffect } from 'react'

export function Controls({isDisabled = false, onSend}) {// Controls component to handle user input and send messages and disable the textarea while loading content
    // It takes a prop onSend which is a function to send the content typed by the user
    const textareaRef = useRef(null);
    const [content,setContent]=useState('');

    useEffect(() => {
        if(!isDisabled){
            textareaRef.current.focus(); // Focus the textarea when it is not disabled  
        }
    }, [isDisabled]);

    function handleContentChange(event){// Function to handle content change in the textarea
        setContent(event.target.value)// Update the content state with the value from the textarea
        // This allows the user to type in the textarea and have the content state reflect that
    }

    function handleContentSend(){ // Function to handle sending content
        // If content is not empty, call onSend with the content and reset the input
        if(content.length>0){
            onSend(content);
            setContent('') //after sending the content, reset the input field
        }
    }

    function handleEnterPress(event){// Check if the Enter key is pressed without Shift
        // If so, prevent the default behavior and send the content
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();// Prevents the default newline behavior
        handleContentSend()// Calls the function to send the content
    }
}
    return (
        <div className={styles.Controls}>
            <div className={styles.TextAreaContainer}>
                <TextAreaAutosize  
                    ref={textareaRef}
                    disabled = {isDisabled} // Disable the textarea while loading content
                    className={styles.TextArea} 
                    placeholder="Ask anything"
                    value={content}
                    minRows={1.5}
                    maxRows={4}
                    onChange={handleContentChange}
                    onKeyDown={handleEnterPress}
                />
            </div> 
            <button 
                className={styles.Button} 
                disabled={isDisabled} 
                onClick={handleContentSend}>
                <SendIcon />
            </button>       
        </div>

    )
} 


function SendIcon(){ //loading send icon svg
    return(
        <svg width="24px" height="24px" viewBox="0 -960 960 960" fill="#5f6368" xmlns="http://www.w3.org/2000/svg">
            <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
        </svg>
    );
}