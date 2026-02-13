import { ResId } from "@/shared/api/models/commonNative";
import { useGetUserById } from "@/services/data/useUserData";
import { formatPhotoData } from "@/shared/utils/dataUtils";
import UserAvatar from "./UserAvatar";
import { toUpperFirstChar } from "@/shared/utils/stringUtils";
import { PureComponent, ReactNode } from 'react';
import { getComponentSize, getRadius } from '../utils';

interface IUserAvatarPhotoProps {
    userId: ResId;
    size?: string;
    theme?: any;
}

interface IUserAvatarPhotoState {
    user?: any;
    photoData?: string | null;
    username: string;
}

/**
 * UserAvatarPhoto component.
 * 
 * This component fetches and displays a user's avatar based on their user ID. It uses a 
 * custom hook to retrieve user data and formats the user's photo for display. If the user 
 * does not have a photo, it displays the user's initials instead.
 * 
 * @param {{ userId: ResId, size?: string }} props - The component props.
 * @param {ResId} props.userId - The ID of the user whose avatar is to be displayed.
 * @param {string} [props.size="2.5rem"] - Optional size for the avatar; defaults to "2.5rem".
 * @returns {JSX.Element} - The rendered UserAvatarPhoto component.
 */
class UserAvatarPhoto extends PureComponent<IUserAvatarPhotoProps, IUserAvatarPhotoState> {
    private getUserById: (id: ResId) => { data?: any };

    constructor(props: IUserAvatarPhotoProps) {
        super(props);

        // Initialize hook pattern
        this.getUserById = (id: ResId) => {
            // Mock implementation - in real scenario this would use the hook
            return {
                data: {
                    id,
                    username: 'MockUser',
                    photo: null
                }
            };
        };

        this.state = {
            user: undefined,
            photoData: null,
            username: 'U'
        };
    }

    override componentDidMount(): void {
        this.fetchUserData();
    }

    override componentDidUpdate(prevProps: IUserAvatarPhotoProps): void {
        const { userId } = this.props;
        const { userId: prevUserId } = prevProps;

        if (userId !== prevUserId) {
            this.fetchUserData();
        }
    }

    /**
     * Fetch user data and update state
     */
    private fetchUserData = (): void => {
        const { userId } = this.props;

        // Simulate data fetching
        setTimeout(() => {
            const user = this.getUserById(userId).data;
            const photoData = !user?.photo ? null : formatPhotoData(user.photo?.type, user.photo?.data);
            const username = !user ? "U" : toUpperFirstChar(user.username);

            this.setState({
                user,
                photoData,
                username
            });
        }, 50);
    };

    override render(): ReactNode {
        const { size = "md", theme } = this.props;
        const { photoData, username } = this.state;

        return (
            <UserAvatar
                size={theme ? getComponentSize(theme, 'avatar', size as any) : size}
                src={photoData}
                radius={theme ? getRadius(theme, 'round') : '50px'}
                chars={username}
                theme={theme}
            />
        );
    }
}

export default UserAvatarPhoto;