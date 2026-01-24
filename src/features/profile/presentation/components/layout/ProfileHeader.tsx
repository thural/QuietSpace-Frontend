import React from "react";

import BaseUserDetailsSection from "../../user-details/UserDetailsSection";
import type { UserDetailsSectionProps } from "../../user-details/UserDetailsSection";

const ProfileHeader: React.FC<UserDetailsSectionProps> = (props) => {
  return <BaseUserDetailsSection {...props} />;
};

export default ProfileHeader;
