import { Avatar } from "@/shared/ui/components"
import { GenericWrapper } from "@shared-types/sharedComponentTypes"

const UserAvatar: React.FC<GenericWrapper> = ({
    forwardedRef,
    size = "2.5rem",
    color = "black",
    radius = "10rem",
    src = "",
    chars = "U",
    ...props
}) => {
    return (
        <Avatar
            ref={forwardedRef}
            color={color}
            size={size}
            radius={radius}
            src={src}
            {...props}
        >
            {chars}
        </Avatar>
    )
}

export default UserAvatar