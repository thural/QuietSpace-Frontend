/**
 * Enhanced MessageInput component with real-time typing indicators
 * 
 * This component replaces the basic MessageInput with modern features including:
 * - Real-time typing indicators
 * - Presence awareness
 * - Enhanced user experience
 * - Analytics integration
 */

import styles from "../../styles/messageInputStyles";
import { ConsumerFn } from "@/shared/types/genericTypes";
import BoxStyled from "@shared/BoxStyled";
import EmojiInput from "@shared/EmojiInput";
import FormStyled from "@shared/FormStyled";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTypingIndicator } from "@features/chat/application/hooks/useChatPresence";
import { PresenceIndicator } from "@features/chat/components/ChatPresenceComponents";
import useUserQueries from "@/core/network/api/queries/userQueries";

/**
 * Props for the Enhanced MessageInput component.
 *
 * @interface EnhancedMessageInputProps
 * @property {string} value - The current value of the input.
 * @property {ConsumerFn} onChange - Callback function to handle input changes.
 * @property {ConsumerFn} onEnter - Callback function to handle the Enter key press.
 * @property {string} placeholder - Placeholder text for the input.
 * @property {boolean} enabled - Indicates if the input is enabled.
 * @property {string} chatId - The ID of the current chat.
 * @property {Function} onTypingStart - Callback when user starts typing.
 * @property {Function} onTypingStop - Callback when user stops typing.
 */
interface EnhancedMessageInputProps {
    value: string;
    onChange: ConsumerFn;
    onEnter: ConsumerFn;
    placeholder: string;
    enabled: boolean;
    chatId: string;
    onTypingStart?: () => void;
    onTypingStop?: () => void;
}

/**
 * Enhanced MessageInput component for sending messages with real-time typing indicators.
 *
 * @param {EnhancedMessageInputProps} props - The props for the MessageInput component.
 * @returns {JSX.Element} - The rendered message input component.
 */
const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({ 
    value, 
    onChange, 
    onEnter, 
    placeholder, 
    enabled, 
    chatId,
    onTypingStart,
    onTypingStop
}) => {
    const classes = styles();
    const messageInput = useRef("");
    const [isFocused, setIsFocused] = useState(false);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    
    // Use typing indicator hook
    const { startTyping, stopTyping } = useTypingIndicator(user.id, chatId);

    // Handle input changes with typing detection
    const handleChange = (newValue: string) => {
        onChange(newValue);
        
        // Start typing indicator if user is typing
        if (newValue.trim() && enabled) {
            if (!showTypingIndicator) {
                setShowTypingIndicator(true);
                startTyping();
                onTypingStart?.();
            }
        } else {
            // Stop typing if input is empty
            if (showTypingIndicator) {
                setShowTypingIndicator(false);
                stopTyping();
                onTypingStop?.();
            }
        }
    };

    // Handle Enter key press
    const handleEnter = (value: string) => {
        // Stop typing when message is sent
        if (showTypingIndicator) {
            setShowTypingIndicator(false);
            stopTyping();
            onTypingStop?.();
        }
        
        onEnter(value);
    };

    // Handle focus events
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Stop typing when input loses focus
        if (showTypingIndicator) {
            setShowTypingIndicator(false);
            stopTyping();
            onTypingStop?.();
        }
    };

    // Auto-stop typing after 3 seconds of inactivity
    useEffect(() => {
        if (showTypingIndicator) {
            const timeout = setTimeout(() => {
                setShowTypingIndicator(false);
                stopTyping();
                onTypingStop?.();
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [showTypingIndicator, stopTyping, onTypingStop]);

    return (
        <BoxStyled className={classes.inputSection}>
            {/* Typing indicator */}
            {showTypingIndicator && (
                <div className="px-3 py-1 bg-blue-50 border-t border-blue-200">
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-blue-600">You are typing...</span>
                    </div>
                </div>
            )}
            
            {/* User presence indicator */}
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Status:</span>
                        <PresenceIndicator 
                            userId={user.id} 
                            showStatus={true} 
                            showTyping={false}
                        />
                    </div>
                    {isFocused && (
                        <span className="text-xs text-green-600">Active</span>
                    )}
                </div>
            </div>

            {/* Main input */}
            <FormStyled className={classes.inputForm}>
                <EmojiInput
                    ref={messageInput}
                    className={classes.messageInput}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    cleanOnEnter
                    buttonElement
                    onEnter={handleEnter}
                    placeholder={placeholder}
                    enabled={enabled}
                />
            </FormStyled>
        </BoxStyled>
    );
};

export default EnhancedMessageInput;
