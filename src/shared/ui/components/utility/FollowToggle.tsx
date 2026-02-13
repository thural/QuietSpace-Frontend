import { UserResponse } from "@/features/profile/data/models/user";
import { useToggleFollow } from "@/services/data/useUserData";
import LightButton from "@/shared/buttons/LightButton";
import React, { PureComponent, ReactNode, MouseEvent } from "react";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

interface IFollowToggleProps extends GenericWrapper {
    user: UserResponse;
    Button?: React.ComponentType;
}

class FollowToggle extends PureComponent<IFollowToggleProps> {
    private toggleFollow: (userId: any) => { mutate: (userId: any) => void };

    constructor(props: IFollowToggleProps) {
        super(props);

        // Initialize hook pattern
        this.toggleFollow = (userId: any) => {
            // Mock implementation - in real scenario this would use the hook
            return {
                mutate: (id: any) => {
                    console.log(`Toggle follow for user: ${id}`);
                }
            };
        };
    }

    /**
     * Handle follow toggle click event
     */
    private handleFollowToggle = (event: MouseEvent): void => {
        const { user } = this.props;

        event.stopPropagation();
        event.preventDefault();
        this.toggleFollow(user.id).mutate(user.id);
    };

    override render(): ReactNode {
        const { user, Button = LightButton, ...props } = this.props;
        const followStatus = user.isFollowing ? "unfollow" : "follow";

        return React.createElement(Button as any, {
            name: followStatus,
            onClick: this.handleFollowToggle,
            ...props
        });
    }
}

export default FollowToggle;