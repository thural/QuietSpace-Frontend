import { Avatar } from "@mantine/core"

const UserAvatar = ({ size = "2.5rem", color = "black", radius = "1rem", src = "", chars = "U" }) => {
    return (
        <Avatar
            color={color}
            size={size}
            radius={radius}
            src={src}>
            {chars}
        </Avatar>
    )
}

export default UserAvatar