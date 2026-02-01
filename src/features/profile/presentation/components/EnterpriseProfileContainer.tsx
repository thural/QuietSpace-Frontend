/**
 * Enterprise ProfileContainer Component
 * 
 * Enhanced profile container with enterprise-grade architecture
 * Consolidated from 4 separate profile containers
 */

import ErrorComponent from "@/shared/errors/ErrorComponent";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { PiSignOut } from "react-icons/pi";
import { useProfile } from "@features/profile/application/hooks/useProfile";
import { useProfileConnections } from "@features/profile/application/hooks/useProfileConnections";
import { useAuthStore } from '@/core/store/zustand';
import { LoadingSpinner } from "@/shared/ui/components";
import {
    ConnectionsList as UserConnections,
    ProfileHeader as UserDetailsSection,
    ProfileStats as FollowsSection,
    ProfileControls,
    ProfileTabs,
} from "../components";

/**
 * Enterprise ProfileContainer component.
 * 
 * This component provides enterprise-grade profile management with:
 * - Support for both current user and other users' profiles
 * - Custom query system with intelligent caching
 * - Advanced error handling and recovery
 * - Signout functionality for current user
 * - Type-safe operations with comprehensive validation
 * 
 * @returns {JSX.Element} - The rendered ProfileContainer component wrapped with error boundary handling.
 */
function EnterpriseProfileContainer() {
    const { userId } = useParams<{ userId?: string }>();
    const { setIsAuthenticated } = useAuthStore();
    const location = useLocation();

    // Determine if this is the current user's profile
    const isCurrentUserProfile = !userId;

    // State management
    const [viewFollowers, setViewFollowers] = useState(false);
    const [viewFollowings, setViewFollowings] = useState(false);

    const toggleFollowers = () => setViewFollowers(!viewFollowers);
    const toggleFollowings = () => setViewFollowings(!viewFollowings);

    // Handle signout
    const handleSignout = () => {
        setIsAuthenticated(false);
        // Additional signout logic can be added here
    };

    // Enterprise hooks with advanced functionality
    const profile = useProfile({
        userId: userId ? parseInt(userId) : undefined
    });
    const connections = useProfileConnections({
        userId: userId ? parseInt(userId) : undefined
    });

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

    // Error handling
    const error = profileError || connectionsError;
    if (error) {
        console.error('ProfileContainer error:', error);
        return <ErrorComponent message={`Error loading profile: ${error.message}`} />;
    }

    // Loading state
    const isLoading = profileLoading || connectionsLoading;
    if (isLoading || !userProfile) {
        return <LoadingSpinner size="md" />;
    }

    // Extract counts from stats
    const postsCount = stats?.postsCount || 0;
    const followingsCount = stats?.followingsCount || 0;
    const followersCount = stats?.followersCount || 0;

    // Render current user profile with signout
    if (isCurrentUserProfile) {
        return (
            <div className="enterprise-profile-container">
                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h3">My Profile</Typography>
                    <Link
                        to="/settings"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            color: '#007bff'
                        }}
                    >
                        Settings
                    </Link>
                    <button
                        onClick={handleSignout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            border: '1px solid #dc3545',
                            borderRadius: '4px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <PiSignOut />
                        Sign Out
                    </button>
                </div>

                <UserDetailsSection user={userProfile} />
                <FollowsSection
                    postsCount={postsCount}
                    followingsCount={followingsCount}
                    followersCount={followersCount}
                    viewFollowers={viewFollowers}
                    viewFollowings={viewFollowings}
                    toggleFollowers={toggleFollowers}
                    toggleFollowings={toggleFollowings}
                />
                <ProfileControls user={userProfile} />
                <ProfileTabs userId={userProfile.id} />
            </div>
        );
    }

    // Render other user's profile
    return (
        <div className="enterprise-profile-container">
            <UserDetailsSection user={userProfile} />
            <FollowsSection
                postsCount={postsCount}
                followingsCount={followingsCount}
                followersCount={followersCount}
                viewFollowers={viewFollowers}
                viewFollowings={viewFollowings}
                toggleFollowers={toggleFollowers}
                toggleFollowings={toggleFollowings}
            />
            <ProfileControls user={userProfile} />
            <ProfileTabs userId={userProfile.id} />
        </div>
    );
}

export default withErrorBoundary(EnterpriseProfileContainer, {
    fallback: <ErrorComponent message="Profile component encountered an error" />,
    onError: (error, errorInfo) => {
        console.error('ProfileContainer error:', error, errorInfo);
    }
});
// Export the component for testing
export { EnterpriseProfileContainer };
