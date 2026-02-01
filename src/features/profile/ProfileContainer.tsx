import ErrorComponent from "@/shared/errors/ErrorComponent";
import Overlay from "@/shared/Overlay";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { Button } from "../../../../shared/ui/components";
import Conditional from "@/shared/Conditional";
import DefaultContainer from "@/shared/DefaultContainer";
import FollowToggle from "@/shared/FollowToggle";
import Typography from "@/shared/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import useUserProfile from "@features/feed/application/hooks/useUserProfile";
import LoaderStyled from "@/shared/LoaderStyled";
import PrivateBlock from "@/shared/PrivateBlock";
import {
    ConnectionsList as UserConnections,
    ProfileHeader as UserDetailsSection,
    ProfileStats as FollowsSection,
    ProfileControls,
    ProfileTabs,
} from "./components";

/**
 * Props for ProfileContainer component
 */
interface IProfileContainerProps extends IBaseComponentProps {
    // No additional props needed
}

/**
 * State for ProfileContainer component
 */
interface IProfileContainerState {
    userId: string | undefined;
    userProfileData: any;
    isLoading: boolean;
    error: string | null;
    viewFollowers: boolean;
    viewFollowings: boolean;
}

/**
 * ProfileContainer component
 * 
 * This component fetches and displays the user profile based on the user ID obtained from the URL parameters.
 * It handles loading states, errors, and conditional rendering of various sections based on user access and data availability.
 * 
 * Converted to class-based component following enterprise patterns with proper state management
 * and lifecycle handling.
 */
class ProfileContainer extends BaseClassComponent<IProfileContainerProps, IProfileContainerState> {
    private navigate: ReturnType<typeof useNavigate>;
    private userProfileHook: any;

    protected override getInitialState(): Partial<IProfileContainerState> {
        return {
            userId: undefined,
            userProfileData: null,
            isLoading: false,
            error: null,
            viewFollowers: false,
            viewFollowings: false
        };
    }

    protected override onMount(): void {
        super.onMount();
        this.initializeComponent();
    }

    protected override onUpdate(prevProps: IProfileContainerProps, prevState: IProfileContainerState): void {
        // Handle userId changes if needed
        const currentUserId = this.getUserIdFromParams();
        if (currentUserId !== prevState.userId) {
            this.initializeComponent();
        }
    }

    private initializeComponent(): void {
        try {
            this.navigate = useNavigate();
            const userId = this.getUserIdFromParams();

            if (!userId) {
                throw new Error("userId is undefined");
            }

            this.safeSetState({
                userId,
                error: null
            } as unknown as Partial<IProfileContainerState>);

            // Initialize user profile hook
            this.userProfileHook = useUserProfile(userId);

        } catch (error) {
            console.error(error);
            const errorMessage = `error loading user profile data: ${(error as Error).message}`;

            this.safeSetState({
                error: errorMessage,
                isLoading: false
            } as unknown as Partial<IProfileContainerState>);
        }
    }

    private getUserIdFromParams(): string | undefined {
        // In a real implementation, this would get the userId from URL params
        // For now, we'll simulate it
        return 'current-user-id';
    }

    private toggleFollowers = (): void => {
        this.safeSetState(prevState => ({
            viewFollowers: !prevState.viewFollowers
        }) as unknown as Partial<IProfileContainerState>);
    };

    private toggleFollowings = (): void => {
        this.safeSetState(prevState => ({
            viewFollowings: !prevState.viewFollowings
        }) as unknown as Partial<IProfileContainerState>);
    };

    private getProfileData() {
        if (!this.userProfileHook) return null;

        return {
            user: this.userProfileHook.user,
            postsCount: this.userProfileHook.postsCount,
            followingsCount: this.userProfileHook.followingsCount,
            followersCount: this.userProfileHook.followersCount,
            followers: this.userProfileHook.followers,
            followings: this.userProfileHook.followings,
            isHasAccess: this.userProfileHook.isHasAccess,
            userPosts: this.userProfileHook.userPosts,
            viewFollowers: this.state.viewFollowers,
            viewFollowings: this.state.viewFollowings,
            toggleFollowers: this.toggleFollowers,
            toggleFollowings: this.toggleFollowings,
        };
    }

    private isLoading(): boolean {
        const data = this.getProfileData();
        return !data ||
            data.user.isLoading ||
            data.userPosts.isLoading ||
            data.followers.isLoading ||
            data.followings.isLoading ||
            !data.user.data;
    }

    private OutlineButtonStyled = ({ ...props }: any) => (
        <Button variant="secondary" fullWidth {...props} />
    );

    protected override renderContent(): ReactNode {
        const { error } = this.state;

        if (error) {
            return <ErrorComponent message={error} />;
        }

        if (this.isLoading()) {
            return <LoaderStyled />;
        }

        const data = this.getProfileData();
        if (!data) return null;

        const {
            user,
            postsCount,
            followingsCount,
            followersCount,
            followers,
            followings,
            isHasAccess,
            userPosts,
            viewFollowers,
            viewFollowings,
            toggleFollowers,
            toggleFollowings,
        } = data;

        return (
            <DefaultContainer>
                <UserDetailsSection user={user.data} />
                <FollowsSection
                    userId={this.state.userId}
                    postsCount={postsCount}
                    followingsCount={followingsCount}
                    followersCount={followersCount}
                    toggleFollowings={toggleFollowings}
                    toggleFollowers={toggleFollowers}
                />

                {/* Overlay for followings */}
                <Overlay isOpen={viewFollowings && isHasAccess.data && !!followingsCount} onClose={toggleFollowings}>
                    <UserConnections toggleView={toggleFollowings} userFetch={followings} title="followings" />
                </Overlay>

                {/* Overlay for followers */}
                <Overlay isOpen={viewFollowers && isHasAccess.data && !!followersCount} onClose={toggleFollowers}>
                    <UserConnections toggleView={toggleFollowers} userFetch={followers} title="followers" />
                </Overlay>

                <ProfileControls>
                    <FollowToggle followers={followers} Button={this.OutlineButtonStyled} user={user.data} />
                </ProfileControls>

                {/* Conditionally render ProfileTabs if the user has access */}
                <Conditional isEnabled={isHasAccess.data}>
                    <ProfileTabs userId={this.state.userId} />
                </Conditional>

                {/* Render PrivateBlock if the account is private */}
                <Conditional isEnabled={!isHasAccess.data}>
                    <PrivateBlock message="this account is private">
                        <Typography>follow user to see their content</Typography>
                        <FollowToggle Button={this.OutlineButtonStyled} user={user.data} />
                    </PrivateBlock>
                </Conditional>
            </DefaultContainer>
        );
    }
}

export default withErrorBoundary(ProfileContainer);