import { createUseStyles } from "react-jss";
import { Theme } from "@shared-types/theme";

export const userDetailsSectionStyles = createUseStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(theme.spacingFactor.md),
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(theme.spacingFactor.sm),
  },
  title: {
    fontSize: theme.typography.fontSize.xLarge,
    fontWeight: "bold",
  },
  content: {
    marginTop: theme.spacing(theme.spacingFactor.sm),
  }
}));
