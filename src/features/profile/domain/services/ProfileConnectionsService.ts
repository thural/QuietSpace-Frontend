import type { UserConnectionEntity } from "../entities";
import { getActiveConnections, getMutualConnections } from "../profileLogic";

export const ProfileConnectionsService = {
  getActive(connections: UserConnectionEntity[]): UserConnectionEntity[] {
    return getActiveConnections(connections);
  },

  getMutual(
    user1Connections: UserConnectionEntity[],
    user2Connections: UserConnectionEntity[]
  ): UserConnectionEntity[] {
    return getMutualConnections(user1Connections, user2Connections);
  }
};
