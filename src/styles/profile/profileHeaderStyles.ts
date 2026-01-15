/**
 * Profile Header Styles.
 * 
 * Styles for the profile header component including
 * avatar, user info, and verification badge.
 */

import { createUseStyles } from "react-jss";

const styles = createUseStyles({
  profileHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1rem"
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  verificationBadge: {
    marginLeft: "0.25rem"
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem"
  },
  displayName: {
    fontWeight: 600,
    fontSize: "1.25rem"
  },
  username: {
    color: "rgb(134, 142, 150)",
    fontSize: "0.9rem"
  },
  bio: {
    marginTop: "0.25rem",
    lineHeight: 1.5
  }
});

export default styles;
