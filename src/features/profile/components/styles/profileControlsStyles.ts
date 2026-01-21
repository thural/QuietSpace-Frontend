import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

export const profileControlsStyles = createUseStyles((theme: Theme) => ({
  container: {
    display: "flex",
    gap: theme.spacing(theme.spacingFactor.sm),
  },
  button: {
    padding: theme.spacing(theme.spacingFactor.sm),
    borderRadius: theme.radius.sm,
  }
}));
