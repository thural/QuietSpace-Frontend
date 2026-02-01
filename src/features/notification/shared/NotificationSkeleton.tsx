import { ReactNode } from 'react';
import { Skeleton } from "@/shared/ui/components"
import { FlexContainer } from "../../../shared/ui/components";
import { BaseClassComponent, IBaseComponentProps } from "@/shared/components/base/BaseClassComponent";

/**
 * Props for NotificationSkeleton component
 */
interface INotificationSkeletonProps extends IBaseComponentProps {
    // No additional props needed for this skeleton component
}

/**
 * State for NotificationSkeleton component
 */
interface INotificationSkeletonState {
    // No state needed for this skeleton component
}

/**
 * NotificationSkeleton component
 * 
 * Provides a loading skeleton for notification items while data is being fetched.
 * Follows the class-based component pattern for consistency with the codebase.
 */
export class NotificationSkeleton extends BaseClassComponent<INotificationSkeletonProps, INotificationSkeletonState> {
    // Styles are defined as private properties to avoid recreation on each render
    private readonly wrapperStyle = {
        display: 'flex',
        height: '3.5rem',
        width: '100%',
        padding: '.5rem 0',
        justifyContent: 'space-between',
        gap: '1rem',
        borderBottom: 'solid lightgrey 1px'
    };

    private readonly circleStyle = {
        maxWidth: '2.5rem',
        minWidth: '2.5rem',
        maxHeight: '2.5rem'
    };

    private readonly lineStyle = {
        minHeight: '1rem',
        height: '1rem',
        alignSelf: 'center'
    };

    protected override renderContent(): ReactNode {
        return (
            <FlexContainer style={this.wrapperStyle} data-testid="notification-skeleton">
                <Skeleton
                    style={this.circleStyle}
                    width={40}
                    height={40}
                    radius="50%"
                    data-testid="notification-avatar-skeleton"
                />
                <Skeleton
                    style={this.lineStyle}
                    height={16}
                    data-testid="notification-content-skeleton"
                />
            </FlexContainer>
        );
    }
}

export default NotificationSkeleton;