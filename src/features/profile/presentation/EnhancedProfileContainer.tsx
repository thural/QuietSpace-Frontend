/**
 * Enhanced ProfileContainer Component.
 * 
 * This component uses the new application layer hooks for
 * clean architecture and enhanced functionality while maintaining
 * backward compatibility with existing components.
 */

import ErrorComponent from "@/shared/errors/ErrorComponent";
import Overlay from "@/shared/Overlay";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import OutlineButton from "@/shared/buttons/OutlineButton";
import Conditional from "@/shared/Conditional";
import DefaultContainer from "@/shared/DefaultContainer";
import FollowToggle from "@/shared/FollowToggle";
import Typography from "@/shared/Typography";
import { useParams } from "react-router-dom";
import { useProfile, useProfileEnhanced } from "../application";
import LoaderStyled from "@/shared/LoaderStyled";
import PrivateBlock from "@/shared/PrivateBlock";
import UserConnections from "../connections/UserConnections";
import FollowsSection from "../follow-section/FollowSection";
import ProfileControls from "../profile-controls/ProfileControls";
import ProfileTabs from "../tabs/ProfileTabs";
import UserDetailsSection from "../user-details/UserDetailsSection";

/**
 * Enhanced ProfileContainer component.
 * 
 * This component demonstrates the new architecture by using the enhanced
 * profile hook with repository pattern integration. It provides:
 * - Clean separation of concerns
 * - Enhanced error handling
 * - Better performance through memoization
 * - Rich functionality with computed values
 * - Backward compatibility with existing components
 * 
 * @returns {JSX.Element} - The rendered ProfileContainer component
 */
function EnhancedProfileContainer() {
    const { userId } = useParams();
    
    // Use enhanced profile hook with repository pattern
    const {
        // New domain entities
        userProfile,
        userStats,
        profileAccess,
        completeProfile,
        userConnections,
        
        // Legacy compatibility
        user,
        postsCount,
        followingsCount,
        followersCount,
        followers,
        followings,
        isHasAccess,
        userPosts,
        
        // UI state
        viewFollowers,
        viewFollowings,
        isLoading,
        error,
        
        // Actions
        toggleFollowers,
        toggleFollowings,
        navigateToProfile,
        refreshProfile,
        followUser,
        unfollowUser,
        
        // Computed values
        canViewProfile,
        accessDeniedReason,
        profileCompletion,
        engagementRate,
        profileStrength
    } = useProfileEnhanced(userId, {
        useMockRepositories: process.env.NODE_ENV === 'development',
        mockConfig: {
            isPrivate: false,
            isVerified: true,
            followersCount: 250,
            followingsCount: 100,
            postsCount: 50
        }
    });

    // Handle loading state
    if (isLoading) {
        return <LoaderStyled />;
    }

    // Handle error state
    if (error) {
        return (
            <ErrorComponent 
                message={`Error loading profile: ${error.message}`}
            />
        );
    }

    // Styled OutlineButton component for consistency
    const OutlineButtonStyled = ({ ...props }) => (
        <OutlineButton color="gray" fullWidth {...props} />
    );

    return (
        <DefaultContainer>
            {/* User Details Section */}
            <UserDetailsSection user={userProfile} />
            
            {/* Profile Statistics */}
            <FollowsSection
                userId={userId}
                postsCount={postsCount}
                followingsCount={followingsCount}
                followersCount={followersCount}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            />
            
            {/* Followings Overlay */}
            <Overlay 
                isOpen={viewFollowings && canViewProfile && !!followingsCount} 
                onClose={toggleFollowings}
            >
                <UserConnections 
                    toggleView={toggleFollowings} 
                    userFetch={followings} 
                    title="followings" 
                />
            </Overlay>
            
            {/* Followers Overlay */}
            <Overlay 
                isOpen={viewFollowers && canViewProfile && !!followersCount} 
                onClose={toggleFollowers}
            >
                <UserConnections 
                    toggleView={toggleFollowings} 
                    userFetch={followers} 
                    title="followers" 
                />
            </Overlay>
            
            {/* Profile Controls */}
            <ProfileControls>
                <FollowToggle 
                    followers={followers} 
                    Button={OutlineButtonStyled} 
                    user={userProfile} 
                />
                
                {/* Enhanced Actions */}
                <OutlineButtonStyled onClick={() => followUser()}>
                    Follow
                </OutlineButtonStyled>
                
                <OutlineButtonStyled onClick={refreshProfile}>
                    Refresh
                </OutlineButtonStyled>
            </ProfileControls>
            
            {/* Profile Tabs */}
            <Conditional isEnabled={canViewProfile}>
                <ProfileTabs userId={userId} />
            </Conditional>
            
            {/* Private Account Block */}
            <Conditional isEnabled={!canViewProfile}>
                <PrivateBlock message={accessDeniedReason}>
                    <Typography>
                        {accessDeniedReason}
                    </Typography>
                    <FollowToggle Button={OutlineButtonStyled} user={userProfile} />
                </PrivateBlock>
            </Conditional>
            
            {/* Profile Stats (Enhanced Feature) */}
            {canViewProfile && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                    <Typography type="h3">Profile Statistics</Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Typography type="h4">{profileCompletion}%</Typography>
                            <Typography>Profile Complete</Typography>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Typography type="h4">{profileStrength}</Typography>
                            <Typography>Profile Strength</Typography>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Typography type="h4">{engagementRate}%</Typography>
                            <Typography>Engagement Rate</Typography>
                        </div>
                    </div>
                </div>
            )}
        </DefaultContainer>
    );
}

/**
 * Legacy ProfileContainer Component.
 * 
 * This component maintains backward compatibility by using the legacy
 * useUserProfile hook. Existing components continue to work
 * without any changes.
 */
function LegacyProfileContainer() {
    const { userId } = useParams();
    
    // Import legacy hook for backward compatibility
    const useUserProfile = require("@/services/hook/profile/useUserProfile").default;
    
    let data = undefined;
    try {
        if (userId === undefined) throw new Error("userId is undefined");
        data = useUserProfile(userId);
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading user profile data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

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

    if (user.isLoading || userPosts.isLoading || followers.isLoading || followings.isLoading || !user.data) {
        return <LoaderStyled />;
    }

    const OutlineButtonStyled = ({ ...props }) => (
        <OutlineButton color="gray" fullWidth {...props} />
    );

    return (
        <DefaultContainer>
            <UserDetailsSection user={user.data} />
            <FollowsSection
                userId={userId}
                postsCount={postsCount}
                followingsCount={followingsCount}
                followersCount={followersCount}
                toggleFollowings={toggleFollowings}
                toggleFollowers={toggleFollowers}
            />
            <Overlay isOpen={viewFollowings && isHasAccess.data && !!followingsCount} onClose={toggleFollowings}>
                <UserConnections toggleView={toggleFollowings} userFetch={followings} title="followings" />
            </Overlay>
            <Overlay isOpen={viewFollowers && isHasAccess.data && !!followersCount} onClose={toggleFollowings}>
                <UserConnections toggleView={toggleFollowings} userFetch={followers} title="followers" />
            </Overlay>
            <ProfileControls>
                <FollowToggle followers={followers} Button={OutlineButtonStyled} user={user.data} />
            </ProfileControls>
            <Conditional isEnabled={isHasAccess.data}>
                <ProfileTabs userId={userId} />
            </Conditional>
            <Conditional isEnabled={!isHasAccess.data}>
                <PrivateBlock message="this account is private">
                    <Typography>follow user to see their content</Typography>
                    <FollowToggle Button={OutlineButtonStyled} user={user.data} />
                </PrivateBlock>
            </Conditional>
        </DefaultContainer>
    );
}

/**
 * ProfileContainer Component with Feature Toggle.
 * 
 * This component allows switching between legacy and enhanced
 * implementations through configuration or environment variables.
 */
function ProfileContainer() {
    // Use enhanced version in development or when flag is set
    const useEnhancedVersion = process.env.NODE_ENV === 'development' || 
                           process.env.REACT_APP_USE_ENHANCED_PROFILE === 'true';
    
    if (useEnhancedVersion) {
        return <EnhancedProfileContainer />;
    }
    
    return <LegacyProfileContainer />;
}

export default withErrorBoundary(ProfileContainer);
