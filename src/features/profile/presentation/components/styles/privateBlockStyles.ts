import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

export const privateBlockStyles = createUseStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(theme.spacingFactor.md),
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.radius.md,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(theme.spacingFactor.sm),
    marginBottom: theme.spacing(theme.spacingFactor.sm),
  },
  icon: {
    color: theme.colors.textSecondary,
  },
  text: {
    color: theme.colors.textSecondary,
  }
}));
