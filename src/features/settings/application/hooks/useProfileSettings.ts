import useUserQueries from "@/core/network/api/queries/userQueries";
import { ProfileSettingsRequest, UserProfileResponse } from "@/features/profile/data/models/user";
import { useSaveProfileSettings } from "@/services/data/useUserData";
import { useState } from "react";

/**
 * Custom hook for managing user profile settings.
 *
 * This hook retrieves the signed-in user's profile settings, 
 * manages the local state for those settings, and provides 
 * functions to handle changes and submission of the settings.
 *
 * @returns {{
 *     user: UserProfileResponse,                       // The signed-in user's profile data.
 *     settings: ProfileSettingsRequest,                // The current state of the profile settings.
 *     isPending: boolean,                              // Indicates if the settings are currently being saved.
 *     handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, // Handler for text input changes.
 *     handleSubmit: () => void,                       // Function to submit the updated settings.
 *     handleSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void // Handler for switch input changes.
 * }} - An object containing state and handler functions for managing profile settings.
 */
const useProfileSettings = () => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user: UserProfileResponse = getSignedUserElseThrow();
    const saveSettings = useSaveProfileSettings(user.id);
    const [settings, setSetting] = useState<ProfileSettingsRequest>(user.settings);

    /**
     * Handles changes to text input fields in the settings form.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const { name, value } = target;
        setSetting({ ...settings, [name]: value });
    };

    /**
     * Handles changes to switch input fields in the settings form.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the switch.
     */
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.currentTarget;
        const { name, checked } = target;
        setSetting({ ...settings, [name]: checked });
    }

    /**
     * Submits the updated profile settings.
     */
    const handleSubmit = () => saveSettings.mutate(settings);

    return {
        user,
        settings,
        isPending: saveSettings.isPending,
        handleChange,
        handleSubmit,
        handleSwitchChange
    }
}

export default useProfileSettings;