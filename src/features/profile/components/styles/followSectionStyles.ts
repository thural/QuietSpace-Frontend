import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

export const followSectionStyles = createUseStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(theme.spacingFactor.md),
  },
  title: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: "bold",
    marginBottom: theme.spacing(theme.spacingFactor.sm),
  },
  followButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: theme.spacing(theme.spacingFactor.sm),
    borderRadius: theme.radius.sm,
  }
}));
