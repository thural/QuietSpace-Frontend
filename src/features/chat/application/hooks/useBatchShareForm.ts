import { ResId } from "@/shared/api/models/commonNative";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { useChatMessaging } from "./useChatMessaging";
import { useMultiSelect, useFormInput } from "@/shared/hooks";

/**
 * useBatchShareForm hook.
 * 
 * This hook manages the state and functionality for sharing a message 
 * with multiple users in a chat context. It provides functions for 
 * sending messages and managing user selections.
 * 
 * @param {ResId} postId - The ID of the post associated with the message.
 * @param {ConsumerFn} toggleForm - A function to toggle the visibility 
 *                                   of the sharing form.
 * @returns {Object} - An object containing the connection status, selected 
 *                    users, and functions for handling user selection, 
 *                    message input changes, and sending messages.
 */
const useBatchShareForm = (postId: ResId, toggleForm: ConsumerFn) => {
    const { sendMessage, isClientConnected } = useChatMessaging(); // Chat messaging functions
    const { selectedItems: selectedUsers, toggleSelection: handleUserSelect } = useMultiSelect<ResId>(); // Multi-select for users
    const { value: message, handleChange: handleMessageChange } = useFormInput(''); // Form input for message

    /**
     * Handles the sending of messages to the selected users.
     * 
     * @param {React.MouseEvent} e - The mouse event triggered by the send action.
     */
    const handleSend = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling
        e.preventDefault(); // Prevent default action

        // Send messages to all selected users
        selectedUsers.forEach((userId: ResId) => {
            sendMessage({
                recipientId: userId,
                text: message,
                postId
            });
        });

        toggleForm(); // Toggle the form visibility after sending
    };

    return {
        isClientConnected, // Connection status of the chat client
        selectedUsers, // List of selected users to send messages to
        handleUserSelect, // Function to handle user selection
        handleMessageChange, // Function to handle message input changes
        handleSend // Function to send messages to selected users
    };
};

export default useBatchShareForm;