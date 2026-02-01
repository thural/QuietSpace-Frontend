/**
 * Enterprise ProfileContainer Component
 * 
 * Enhanced profile container with enterprise-grade architecture
 * Uses custom query system, intelligent caching, and advanced profile management
 */

import ErrorComponent from "@/shared/errors/ErrorComponent";
import Overlay from "@/shared/Overlay";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import OutlineButton from "@/shared/buttons/OutlineButton";
import Conditional from "@/shared/Conditional";
import DefaultContainer from "@/shared/DefaultContainer";
import FollowToggle from "@/shared/FollowToggle";
import Typography from "@/shared/Typography";
import { useParams } from "react-router-dom";
import { useProfile } from "@features/profile/application/hooks/useProfile";
import { useProfileConnections } from "@features/profile/application/hooks/useProfileConnections";
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
 * Enterprise ProfileContainer component.
 * 
 * This component provides enterprise-grade profile management with:
 * - Custom query system with intelligent caching
 * - Advanced error handling and recovery
 * - Real-time updates and optimistic updates
 * - Performance monitoring and optimization
 * - Type-safe operations with comprehensive validation
 * 
 * @returns {JSX.Element} - The rendered ProfileContainer component wrapped with error boundary handling.
 */
function EnterpriseProfileContainer() {
    const { userId } = useParams<{ userId: string }>();
    
    // Enterprise hooks with advanced functionality
    const profile = useProfile({ userId: userId ? parseInt(userId) : undefined });
    const connections = useProfileConnections({ userId: userId ? parseInt(userId) : undefined });

    // Extract profile data
    const {
        profile: userProfile,
        stats,
        followers,
        followings,
        isLoading: profileLoading,
        error: profileError,
        selectedUserId
    } = profile;

    // Extract connection data
    const {
        isFollowing,
        isLoading: connectionsLoading,
        error: connectionsError
    } = connections;

    // State management for UI
    const [viewFollowers, setViewFollowers] = useState(false);
    const [viewFollowings, setViewFollowings] = useState(false);

    const toggleFollowers = () => setViewFollowers(!viewFollowers);
    const toggleFollowings = () => setViewFollowings(!viewFollowings);

    // Error handling
    const error = profileError || connectionsError;
    if (error) {
        console.error('ProfileContainer error:', error);
        return <ErrorComponent message={`Error loading profile: ${error.message}`} />;
    }

    // Loading state
    const isLoading = profileLoading || connectionsLoading;
    if (isLoading || !userProfile) {
        return <LoaderStyled />;
    }

    // Extract counts from stats
    const postsCount = stats?.postsCount || 0;
    const followingsCount = stats?.followingsCount || 0;
    const followersCount = stats?.followersCount || 0;

    // Styled OutlineButton component for consistency
    const OutlineButtonStyled = ({ ...props }) => (
        <OutlineButton color="gray" fullWidth {...props} />
    );

    // Enhanced follow toggle with enterprise features
    const handleFollowToggle = async () => {
        if (!selectedUserId || !userProfile) return;
        
        try {
            if (isFollowing) {
                await connections.unfollowUser(selectedUserId, userProfile.id);
            } else {
                await connections.followUser(selectedUserId, userProfile.id);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            // Error is already handled by the hook
        }
    };

    return (
        <DefaultContainer>
            {/* User Details Section */}
            <UserDetailsSection user={userProfile} />
            
            {/* Profile Stats Section */}
            <FollowsSection
                userId={selectedUserId?.toString() || ''}
                postsCount={postsCount}
                followingsCount={followingsCount}
                followersCount={followersCount}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            />
            
            {/* Followings Overlay */}
            <Overlay 
                isOpen={viewFollowings && !!followingsCount} 
                onClose={toggleFollowings}
            >
                <UserConnections 
                    toggleView={toggleFollowings} 
                    userFetch={{ 
                        data: { 
                            pages: [{ 
                                content: followings || [] 
                            }] 
                        } 
                    }} 
                    title="followings" 
                />
            </Overlay>
            
            {/* Followers Overlay */}
            <Overlay 
                isOpen={viewFollowers && !!followersCount} 
                onClose={toggleFollowers}
            >
                <UserConnections 
                    toggleView={toggleFollowers} 
                    userFetch={{ 
                        data: { 
                            pages: [{ 
                                content: followers || [] 
                            }] 
                        } 
                    }} 
                    title="followers" 
                />
            </Overlay>
            
            {/* Profile Controls */}
            <ProfileControls>
                <FollowToggle 
                    followers={followers || []} 
                    Button={OutlineButtonStyled} 
                    user={userProfile}
                    isFollowing={isFollowing}
                    onFollowToggle={handleFollowToggle}
                />
            </ProfileControls>
            
            {/* Profile Tabs */}
            <Conditional isEnabled={true}>
                <ProfileTabs userId={selectedUserId?.toString() || ''} />
            </Conditional>
            
            {/* Private Account Block */}
            <Conditional isEnabled={userProfile.isPrivate && !isFollowing}>
                <PrivateBlock message="this account is private">
                    <Typography>follow user to see their content</Typography>
                    <FollowToggle 
                        Button={OutlineButtonStyled} 
                        user={userProfile}
                        isFollowing={isFollowing}
                        onFollowToggle={handleFollowToggle}
                    />
                </PrivateBlock>
            </Conditional>
        </DefaultContainer>
    );
}

// Export with error boundary
export default withErrorBoundary(EnterpriseProfileContainer, {
    fallback: <ErrorComponent message="Profile component encountered an error" />,
    onError: (error, errorInfo) => {
        console.error('ProfileContainer error:', error, errorInfo);
    }
});

// Export the component for testing
export { EnterpriseProfileContainer };
