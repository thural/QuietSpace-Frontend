import { Avatar } from "@mantine/core"

const UserAvatar = ({
    forwardedRef,
    size = "2.5rem",
    color = "black",
    radius = "9rem",
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