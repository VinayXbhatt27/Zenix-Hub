import styles from './Assistants.module.css';
import { Assistant as GoogleAssistant } from '../../assistants/googleai.js'; 
import { Assistant as LlamaAssistant } from '../../assistants/llamaai.js'; 
import {Assistant as DeepseekAssistant} from  '../../assistants/deepseekai.js'
import { useEffect, useState } from 'react';

const assistantMap={
    googleai: GoogleAssistant,
    llamaai: LlamaAssistant,
    deepseekai: DeepseekAssistant
}

export function Assistants({onAssistantChange}) {
    const [value, setValue] = useState('googleai:gemini-2.0-flash');

    function handleValueChange(event){
        setValue(event.target.value);
    }

    useEffect(() => {
        const [assistant, model] = value.split(':');
        // Find the selected option element to get its data-type
        const selectedOption = document.querySelector(`option[value="${value}"]`);
        const modelType = selectedOption.getAttribute('data-type') || 'text'; // Default to 'text'
        const AssistantClass = assistantMap[assistant];

        if (!AssistantClass) {
            throw new Error(`Unknown assistant: ${assistant} or model: ${model}`);
        }
        // Pass the model and its type to the constructor
        onAssistantChange(new AssistantClass(model, modelType));
    }, [value]);

    return (
        <div className={styles.Assistant}>
            <span>Assistants:</span>
            <select value={value} onChange={handleValueChange} className={styles.dropdown}>
                <optgroup label="Google AI">
                    <option value="googleai:gemini-2.0-flash" data-type="text">Gemini 2.0 Flash</option>
                    <option value="googleai:gemini-2.0-flash-lite" data-type="text">Gemini 2.0 Flash -Lite</option>
                    {/* Add data-type="image" for the image generation model */}
                    <option value="googleai:gemini-2.0-flash-preview-image-generation" data-type="image" data-modalities='["TEXT","IMAGE"]'>
                      Gemini 2.0 Flash (For Image Generation)
                    </option>

                </optgroup>
                <optgroup label="DeepSeek AI">
                    <option value="deepseekai:deepseek/deepseek-chat">DeepSeek-V3</option>
                </optgroup>
                <optgroup label="LLaMA AI">
                    <option value="llamaai:meta-llama/llama-3.3-70b-instruct">Meta - Llama 3.3 70B Instruct</option>
                    <option value="llamaai:meta-llama/llama-3.2-3b-instruct:free">Meta - Llama 3.2 3B Instruct</option>
                </optgroup>
            </select>
        </div>
    )
}