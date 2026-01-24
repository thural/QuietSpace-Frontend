import React from "react";

import BaseUserConnections from "../../connections/UserConnections";
import type { ConnectionsProps } from "../../connections/UserConnections";

const ConnectionsList: React.FC<ConnectionsProps> = (props) => {
  return <BaseUserConnections {...props} />;
};

export default ConnectionsList;
