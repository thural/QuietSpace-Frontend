import React from "react";

import BaseFollowSection from "../../follow-section/FollowSection";
import type { FollowSectionProps } from "../../follow-section/FollowSection";

const ProfileStats: React.FC<FollowSectionProps> = (props) => {
  return <BaseFollowSection {...props} />;
};

export default ProfileStats;
