/**
 * UserAvatar Wrapper Component
 * 
 * Legacy wrapper for backward compatibility.
 * New implementations should use the decoupled version from ./UserAvatar/
 */

import UserAvatar as DecoupledUserAvatar from './UserAvatar';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { PureComponent, ReactNode } from 'react';

interface IUserAvatarProps extends GenericWrapper {
    forwardedRef?: any;
    size?: string;
    color?: string;
    radius?: string;
    src?: string;
    chars?: string;
    theme?: any;
}

/**
 * @deprecated Use UserAvatar from ./UserAvatar/ instead
 */
class UserAvatar extends PureComponent<IUserAvatarProps> {
    override render(): ReactNode {
        return <DecoupledUserAvatar {...this.props} />;
    }
}

export default UserAvatar;