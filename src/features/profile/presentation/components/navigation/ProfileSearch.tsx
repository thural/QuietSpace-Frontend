import React from "react";

import BaseSearchBar from "../../searchbar/SearchBar";
import type { SearchBarProps } from "../../searchbar/SearchBar";

const ProfileSearch: React.FC<SearchBarProps> = (props) => {
  return <BaseSearchBar {...props} />;
};

export default ProfileSearch;
