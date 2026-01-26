import { createUseStyles } from "react-jss";
import { Theme } from "@shared-types/theme";

export const userListStyles = createUseStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing?.(theme.spacingFactor?.md || 16) || "16px",
  },
  item: {
    padding: theme.spacing?.(theme.spacingFactor?.sm || 8) || "8px",
    borderBottom: `1px solid ${theme.colors?.border || "#ccc"}`,
  },
  resultContainer: {
    width: "100%",
    height: "100%",
  }
}));

export default userListStyles;
