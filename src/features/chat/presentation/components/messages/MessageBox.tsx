import React from 'react';
import { MessageResponse } from "@/features/chat/data/models/chat";
import useMessage from "@features/chat/application/hooks/useMessage";
import { MessageCard } from '../../../../../shared/ui/components/social';
import type { IMessageCardProps } from '../../../../../shared/ui/components/social';
import { ResId } from '@/shared/api/models/commonNative';
import useHoverState from '@shared/hooks/useHoverState';

/**
 * Props for the MessageBox component.
 *
 * @interface MessageBoxProps
 * @property {MessageResponse} message - The message data to display.
 * @property {React.CSSProperties} [style] - Optional custom styles for the message box.
 * @property {(messageId: ResId) => void} [onDelete] - Optional callback function to handle message deletion.
 */
interface MessageBoxProps {
    message: MessageResponse;
    style?: React.CSSProperties;
    onDelete?: (messageId: ResId) => void;
}

/**
 * MessageBox component that displays a message and provides options for deletion.
 *
 * @param {MessageBoxProps} props - The props for the MessageBox component.
 * @returns {JSX.Element} - The rendered message box component.
 */
const MessageBox: React.FC<MessageBoxProps> = ({
    message,
    style,
    onDelete
}) => {
    const { user, messageSeenStatus } = useMessage(message);
    const {
        isHovering,
        handleMouseOver,
        handleMouseOut
    } = useHoverState();

    const handleDeleteMessage = () => {
        if (onDelete) {
            onDelete(message.id);
        } else {
            const { handleDeleteMessage: defaultDelete } = useMessage(message);
            defaultDelete();
        }
    };

    // Convert message data to MessageCard props
    const messageCardProps: IMessageCardProps = {
        message: message.text,
        sender: user ? {
            name: user.username,
        } : {
            name: 'Unknown User',
        },
        timestamp: new Date(message.createDate || Date.now()).toLocaleString(),
        isOwn: message.senderId === user?.id,
        status: messageSeenStatus?.isSeen ? 'read' : 'sent',
        showDelete: message.senderId === user?.id && isHovering,
        onDelete: handleDeleteMessage,
        onClick: () => {
            console.log(`Message clicked: ${message.id}`);
        },
    };

    return (
        <div
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            style={style}
        >
            <MessageCard {...messageCardProps} />
        </div>
    );
};


/**
 * Memoized version of the MessageBox component for performance optimization.
 */
const MemoizedMessageBox = React.memo(MessageBox, (prevProps, nextProps) =>
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.text === nextProps.message.text &&
    prevProps.message.isSeen === nextProps.message.isSeen
);

export { MessageBox, MemoizedMessageBox };
export default MessageBox;