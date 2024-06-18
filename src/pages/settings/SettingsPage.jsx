import React from "react";
import SettingsContainer from "../../components/Settings/SettingContainer";
import RenderOnAuthenticated from "../../components/Misc/RenderOnAuthenticated";


const SettingsPage = () => {
    return <RenderOnAuthenticated>
        <SettingsContainer />
    </RenderOnAuthenticated>;
}

export default SettingsPage