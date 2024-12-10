
import { ResId } from "@/api/schemas/native/common";
import { ConsumerFn } from "@/types/genericTypes";
import { useChatMessaging } from "./useChatMessaging";
import useMultiSelect from "../shared/useMultiSelect";
import useFormInput from "../shared/useFormInput";

const useBatchShareForm = (postId: ResId, toggleForm: ConsumerFn) => {
    const { sendMessage, isClientConnected } = useChatMessaging();
    const { selectedItems: selectedUsers, toggleSelection: handleUserSelect } = useMultiSelect<ResId>();
    const { value: message, handleChange: handleMessageChange } = useFormInput('');

    const handleSend = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        selectedUsers.forEach((userId: ResId) => {
            sendMessage({
                recipientId: userId,
                text: message,
                postId
            });
        });

        toggleForm();
    };

    return {
        isClientConnected,
        selectedUsers,
        handleUserSelect,
        handleMessageChange,
        handleSend
    };
};

export default useBatchShareForm