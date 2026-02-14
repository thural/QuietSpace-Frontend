/**
 * UserCard Wrapper Component
 * 
 * Legacy wrapper for backward compatibility.
 * New implementations should use the decoupled version from ./UserCard/
 */

import UserCard as DecoupledUserCard from './UserCard';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { PureComponent, ReactNode } from 'react';

interface IUserCardProps extends GenericWrapper {
    userId?: any;
    isDisplayEmail?: boolean;
    isDisplayName?: boolean;
    isIgnoreNavigation?: boolean;
    children?: ReactNode;
}

/**
 * @deprecated Use UserCard from ./UserCard/ instead
 */
class UserCard extends PureComponent<IUserCardProps> {
    override render(): ReactNode {
        return <DecoupledUserCard {...this.props} />;
    }
}

export default UserCard;