import { Avatar } from "@mantine/core"

const UserAvatar = ({
    size = "2.5rem",
    color = "black",
    radius = "1rem",
    src = "",
    chars = "U",
    ...props
}) => {
    return (
        <Avatar
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