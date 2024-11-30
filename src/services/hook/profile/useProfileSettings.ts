import { getSignedUserElseThrow } from "@/api/queries/userQueries"
import { ProfileSettingsRequest, UserProfileResponse } from "@/api/schemas/inferred/user"
import { useSaveProfileSettings } from "@/services/data/useUserData"
import { useState } from "react"

const useProfileSettings = () => {

    const user: UserProfileResponse = getSignedUserElseThrow();
    const saveSettings = useSaveProfileSettings(user.id);
    const [settings, setSetting] = useState<ProfileSettingsRequest>(user.settings);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const { name, value } = target;
        setSetting({ ...settings, [name]: value });
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.currentTarget;
        const { name, checked } = target;
        setSetting({ ...settings, [name]: checked });
    }

    const handleSubmit = () => saveSettings.mutate(settings);

    return {
        user,
        settings,
        handleChange,
        handleSubmit,
        handleSwitchChange
    }
}

export default useProfileSettings