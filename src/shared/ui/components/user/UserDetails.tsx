import { UserResponse } from "@/features/profile/data/models/user";
import { Container } from '@/shared/ui/components/layout/Container';
import styles from "@/shared/styles/userDetailsStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import Typography, { headingSize } from "./Typography";
import Conditional from "./Conditional";

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
interface UserDetailsProps extends GenericWrapper {
    user: UserResponse;
    isDisplayEmail?: boolean;
    isDisplayName?: boolean;
    scale?: number;
}

/**
 * UserDetails component.
 * 
 * This component displays a user's details, including their username and email. 
 * It allows for optional rendering of these details based on the provided props. 
 * The component also adjusts the font size of the displayed text based on a scale factor.
 * 
 * @param {UserDetailsProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserDetails component.
 */
const UserDetails: React.FC<UserDetailsProps> = ({
    user,
    scale = 3,
    isDisplayEmail = true,
    isDisplayName = true,
    children
}) => {
    const classes = styles(); // Apply styles

    // Determine the effective size based on the scale prop
    const size = (() => {
        if (typeof scale !== "number") return 3; // Default size
        return scale < 1 ? 1 : scale > 6 ? 6 : scale; // Limit scale between 1 and 6
    })();

    // Calculate the font size based on the determined scale
    const fontSize = (() => {
        const value = 3 / size; // Base font size divided by scale
        const normalizedSize = value < 0.8 ? 0.8 : value > 2 ? 2 : value; // Normalize font size
        return `${normalizedSize}rem`;
    })();

    const heading = `h${size}` as headingSize; // Determine heading type

    return (
        <Container key={user.id} className={classes.userDetails}>
            <Conditional isEnabled={isDisplayName}>
                <Typography type={heading} className="username">{user.username}</Typography> {/* Display username */}
            </Conditional>
            <Conditional isEnabled={isDisplayEmail}>
                <Typography style={{ fontSize }} lineClamp={1} truncate="end" className="email">{user.email}</Typography> {/* Display email */}
            </Conditional>
            {children} {/* Render any additional children */}
        </Container>
    );
};

export default UserDetails;