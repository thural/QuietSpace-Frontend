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

    const handleSubmit = () => saveSettings.mutate(settings);

    return {
        user,
        settings,
        handleChange,
        handleSubmit
    }
}

export default useProfileSettings