import React from "react";

import BaseProfileTabs from "../../tabs/ProfileTabs";
import type { ResId } from "@/api/schemas/native/common";
import type { GenericWrapper } from "@/types/sharedComponentTypes";

interface ProfileTabsProps extends GenericWrapper {
  userId: ResId;
}

const ProfileTabs: React.FC<ProfileTabsProps> = (props) => {
  return <BaseProfileTabs {...props} />;
};

export default ProfileTabs;
