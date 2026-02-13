import { Avatar } from "@/shared/ui/components"
import { GenericWrapper } from "@shared-types/sharedComponentTypes"
import { PureComponent, ReactNode } from 'react';
import { getComponentSize, getRadius } from '../utils';

interface IUserAvatarProps extends GenericWrapper {
    forwardedRef?: any;
    size?: string;
    color?: string;
    radius?: string;
    src?: string;
    chars?: string;
    theme?: any;
}

class UserAvatar extends PureComponent<IUserAvatarProps> {
    override render(): ReactNode {
        const {
            forwardedRef,
            size = "md",
            color = "black",
            radius = "round",
            src = "",
            chars = "U",
            theme,
            ...props
        } = this.props;

        return (
            <Avatar
                ref={forwardedRef}
                color={color}
                size={theme ? getComponentSize(theme, 'avatar', size as any) : size}
                radius={theme ? getRadius(theme, radius as any) : radius}
                src={src}
                {...props}
            >
                {chars}
            </Avatar>
        )
    }
}

export default UserAvatar