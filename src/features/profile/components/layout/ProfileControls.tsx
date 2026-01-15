import React from "react";

import BaseProfileControls from "../../profile-controls/ProfileControls";
import type { GenericWrapper } from "@/types/sharedComponentTypes";

const ProfileControls: React.FC<GenericWrapper> = (props) => {
  return <BaseProfileControls {...props} />;
};

export default ProfileControls;
