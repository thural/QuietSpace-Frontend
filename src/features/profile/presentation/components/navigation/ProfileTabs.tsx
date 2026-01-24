import React from "react";

import BaseProfileTabs from "../../tabs/ProfileTabs";
import type { ResId } from "@/shared/api/models/commonNative";
import type { GenericWrapper } from "@shared-types/sharedComponentTypes";

interface ProfileTabsProps extends GenericWrapper {
  userId: ResId;
}

const ProfileTabs: React.FC<ProfileTabsProps> = (props) => {
  return <BaseProfileTabs {...props} />;
};

export default ProfileTabs;
