/**
 * Enhanced ProfileContainer Component.
 * 
 * This component uses the new application layer hooks for
 * clean architecture and enhanced functionality while maintaining
 * backward compatibility with existing components.
 */

import OutlineButton from "@/shared/buttons/OutlineButton";
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import Conditional from "@/shared/Conditional";
import DefaultContainer from "@/shared/DefaultContainer";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import LoaderStyled from "@/shared/LoaderStyled";
import Overlay from "@/shared/Overlay";
import PrivateBlock from "@/shared/PrivateBlock";
import Typography from "@/shared/Typography";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useProfile, useProfileEnhanced } from "../application";
import {
    ProfileStats as FollowsSection,
    ProfileControls,
    ProfileTabs,
    ConnectionsList as UserConnections,
    ProfileHeader as UserDetailsSection,
} from "../components";

export interface IEnhancedProfileContainerProps extends IBaseComponentProps {
    // No additional props needed - uses URL params
}

interface IEnhancedProfileContainerState extends IBaseComponentState {
    userId: string;
    userProfile: any;
    userStats: any;
    profileAccess: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
    profileHook: any;
    enhancedProfileHook: any;
    showEditModal: boolean;
    showSettingsModal: boolean;
}

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
 * Converted to class-based component following enterprise patterns.
 */
class EnhancedProfileContainer extends BaseClassComponent<IEnhancedProfileContainerProps, IEnhancedProfileContainerState> {

    protected override getInitialState(): Partial<IEnhancedProfileContainerState> {
        return {
            userId: '',
            userProfile: null,
            userStats: null,
            profileAccess: null,
            isLoading: true,
            isError: false,
            error: null,
            profileHook: null,
            enhancedProfileHook: null,
            showEditModal: false,
            showSettingsModal: false
        };
    }

    protected override onMount(): void {
        super.onMount();
        this.initializeProfile();
    }

    protected override onUpdate(): void {
        this.updateProfileState();
    }

    /**
     * Initialize profile data
     */
    private initializeProfile = (): void => {
        const { userId } = useParams();

        // Use enhanced profile hook with repository pattern
        const profileHook = useProfile(userId);
        const enhancedProfileHook = useProfileEnhanced(userId);

        this.safeSetState({
            userId: userId || '',
            profileHook,
            enhancedProfileHook
        });

        this.updateProfileState();
    };

    /**
     * Update profile state from hooks
     */
    private updateProfileState = (): void => {
        if (this.state.enhancedProfileHook) {
            const {
                // New domain entities
                userProfile,
                userStats,
                profileAccess,
                isLoading,
                isError,
                error
            } = this.state.enhancedProfileHook;

            this.safeSetState({
                userProfile,
                userStats,
                profileAccess,
                isLoading,
                isError,
                error
            });
        }
    };

    /**
     * Toggle edit modal
     */
    private toggleEditModal = (): void => {
        this.safeSetState(prev => ({ showEditModal: !prev.showEditModal }));
    };

    /**
     * Toggle settings modal
     */
    private toggleSettingsModal = (): void => {
        this.safeSetState(prev => ({ showSettingsModal: !prev.showSettingsModal }));
    };

    /**
     * Handle profile update
     */
    private handleProfileUpdate = async (profileData: any): Promise<void> => {
        try {
            // Update profile logic would go here
            console.log('Updating profile:', profileData);
            this.toggleEditModal();
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    /**
     * Handle settings update
     */
    private handleSettingsUpdate = async (settingsData: any): Promise<void> => {
        try {
            // Update settings logic would go here
            console.log('Updating settings:', settingsData);
            this.toggleSettingsModal();
        } catch (error) {
            console.error('Failed to update settings:', error);
        }
    };

    /**
     * Render loading state
     */
    private renderLoading = (): ReactNode => {
        return (
            <DefaultContainer>
                <LoaderStyled />
            </DefaultContainer>
        );
    };

    /**
     * Render error state
     */
    private renderError = (): ReactNode => {
        const { error } = this.state;

        return (
            <ErrorComponent
                message={`Error loading profile: ${error?.message || 'Unknown error'}`}
                action={
                    <OutlineButton onClick={() => window.location.reload()}>
                        Retry
                    </OutlineButton>
                }
            />
        );
    };

    /**
     * Render edit modal
     */
    private renderEditModal = (): ReactNode => {
        const { showEditModal, userProfile } = this.state;

        if (!showEditModal) return null;

        return (
            <Overlay onClose={this.toggleEditModal}>
                <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
                    <Typography variant="h3" style={{ marginBottom: '20px' }}>
                        Edit Profile
                    </Typography>
                    <div>
                        <Typography variant="body1">
                            Edit profile form would go here
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: '10px' }}>
                            Current profile: {JSON.stringify(userProfile, null, 2)}
                        </Typography>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <OutlineButton onClick={() => this.handleProfileUpdate(userProfile)}>
                            Save Changes
                        </OutlineButton>
                        <OutlineButton onClick={this.toggleEditModal}>
                            Cancel
                        </OutlineButton>
                    </div>
                </div>
            </Overlay>
        );
    };

    /**
     * Render settings modal
     */
    private renderSettingsModal = (): ReactNode => {
        const { showSettingsModal, userProfile } = this.state;

        if (!showSettingsModal) return null;

        return (
            <Overlay onClose={this.toggleSettingsModal}>
                <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
                    <Typography variant="h3" style={{ marginBottom: '20px' }}>
                        Profile Settings
                    </Typography>
                    <div>
                        <Typography variant="body1">
                            Settings form would go here
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: '10px' }}>
                            Current settings: {JSON.stringify(userProfile?.settings, null, 2)}
                        </Typography>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <OutlineButton onClick={() => this.handleSettingsUpdate(userProfile?.settings)}>
                            Save Settings
                        </OutlineButton>
                        <OutlineButton onClick={this.toggleSettingsModal}>
                            Cancel
                        </OutlineButton>
                    </div>
                </div>
            </Overlay>
        );
    };

    protected override renderContent(): ReactNode {
        const { isLoading, isError, userProfile, userStats, profileAccess } = this.state;

        if (isLoading) {
            return this.renderLoading();
        }

        if (isError) {
            return this.renderError();
        }

        return (
            <DefaultContainer>
                <div style={{ padding: '20px' }}>
                    {/* Profile Header */}
                    <UserDetailsSection
                        user={userProfile}
                        stats={userStats}
                        access={profileAccess}
                    />

                    {/* Profile Controls */}
                    <ProfileControls
                        user={userProfile}
                        access={profileAccess}
                        onEditProfile={this.toggleEditModal}
                        onSettings={this.toggleSettingsModal}
                    />

                    {/* Profile Stats */}
                    <FollowsSection
                        stats={userStats}
                        access={profileAccess}
                    />

                    {/* Profile Tabs */}
                    <ProfileTabs
                        user={userProfile}
                        access={profileAccess}
                    />

                    {/* User Connections */}
                    <Conditional isEnabled={profileAccess?.canViewConnections}>
                        <UserConnections
                            userId={this.state.userId}
                            access={profileAccess}
                        />
                    </Conditional>

                    {/* Private Content */}
                    <Conditional isEnabled={!profileAccess?.canViewPrivateContent}>
                        <PrivateBlock
                            message="This profile is private. Follow to see more content."
                            Icon={() => <span>🔒</span>}
                        />
                    </Conditional>

                    {/* Edit Modal */}
                    {this.renderEditModal()}

                    {/* Settings Modal */}
                    {this.renderSettingsModal()}
                </div>
            </DefaultContainer>
        );
    }
}

export default withErrorBoundary(EnhancedProfileContainer);