import { Avatar } from "@/shared/ui/components"
import { GenericWrapper } from "@shared-types/sharedComponentTypes"
import React, { PureComponent, ReactNode } from 'react';

interface IUserAvatarProps extends GenericWrapper {
    forwardedRef?: any;
    size?: string;
    color?: string;
    radius?: string;
    src?: string;
    chars?: string;
}

class UserAvatar extends PureComponent<IUserAvatarProps> {
    override render(): ReactNode {
        const {
            forwardedRef,
            size = "2.5rem",
            color = "black",
            radius = "10rem",
            src = "",
            chars = "U",
            ...props
        } = this.props;

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
}

export default UserAvatar