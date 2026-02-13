import { UserResponse } from "@/features/profile/data/models/user";
import { Container } from '@/shared/ui/components/layout/Container';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import Typography, { headingSize } from "../utility/Typography";
import Conditional from "../utility/Conditional";
import React, { PureComponent, ReactNode } from "react";

/**
 * UserDetailsProps interface.
 * 
 * This interface defines the props for the UserDetails component.
 * 
 * @property {UserResponse} user - The user object containing details to display.
 * @property {boolean} [isDisplayEmail=true] - Indicates whether to display the user's email.
 * @property {boolean} [isDisplayName=true] - Indicates whether to display the user's name.
 * @property {number} [scale=3] - A scale factor for adjusting the size of the displayed text.
 */
interface IUserDetailsProps extends GenericWrapper {
    user: UserResponse;
    isDisplayEmail?: boolean;
    isDisplayName?: boolean;
    scale?: number;
    children?: ReactNode;
}

interface IUserDetailsState {
    size: number;
    fontSize: string;
    heading: headingSize;
}

/**
 * UserDetails component.
 * 
 * This component displays a user's details, including their username and email. 
 * It allows for optional rendering of these details based on the provided props. 
 * The component also adjusts the font size of the displayed text based on a scale factor.
 * 
 * @param {IUserDetailsProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserDetails component.
 */
class UserDetails extends PureComponent<IUserDetailsProps, IUserDetailsState> {
    constructor(props: IUserDetailsProps) {
        super(props);

        const { scale = 3 } = props;

        // Determine the effective size based on the scale prop
        const effectiveSize = (() => {
            if (typeof scale !== "number") return 3; // Default size
            return scale < 1 ? 1 : scale > 6 ? 6 : scale; // Limit scale between 1 and 6
        })();

        // Calculate the font size based on the determined scale
        const calculatedFontSize = (() => {
            const value = 3 / effectiveSize; // Base font size divided by scale
            const normalizedSize = value < 0.8 ? 0.8 : value > 2 ? 2 : value; // Normalize font size
            return `${normalizedSize}rem`;
        })();

        const headingType = `h${effectiveSize}` as headingSize; // Determine heading type

        this.state = {
            size: effectiveSize,
            fontSize: calculatedFontSize,
            heading: headingType
        };
    }

    override componentDidUpdate(prevProps: IUserDetailsProps): void {
        const { scale = 3 } = this.props;
        const { scale: prevScale = 3 } = prevProps;

        if (scale !== prevScale) {
            // Recalculate size and font size if scale changes
            const effectiveSize = (() => {
                if (typeof scale !== "number") return 3;
                return scale < 1 ? 1 : scale > 6 ? 6 : scale;
            })();

            const calculatedFontSize = (() => {
                const value = 3 / effectiveSize;
                const normalizedSize = value < 0.8 ? 0.8 : value > 2 ? 2 : value;
                return `${normalizedSize}rem`;
            })();

            const headingType = `h${effectiveSize}` as headingSize;

            this.setState({
                size: effectiveSize,
                fontSize: calculatedFontSize,
                heading: headingType
            });
        }
    }

    override render(): ReactNode {
        const { user, isDisplayEmail = true, isDisplayName = true, children } = this.props;
        const { fontSize, heading } = this.state;

        return (
            <Container key={user.id}>
                <Conditional isEnabled={isDisplayName}>
                    <Typography type={heading} className="username">{user.username}</Typography> {/* Display username */}
                </Conditional>
                <Conditional isEnabled={isDisplayEmail}>
                    <Typography style={{ fontSize }} lineClamp={1} truncate="end" className="email">{user.email}</Typography> {/* Display email */}
                </Conditional>
                {children} {/* Render any additional children */}
            </Container>
        );
    }
}

export default UserDetails;
export type { IUserDetailsProps };