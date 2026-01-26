import { createUseStyles } from "react-jss";
import { Theme } from "@shared-types/theme";

const useStyles = createUseStyles((theme: Theme) => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(theme.spacingFactor.md)
  },

  content: {
    maxWidth: '100%',
    marginRight: theme.spacing(theme.spacingFactor.md)
  },

  controls: {
    justifyContent: 'flex-end'
  }
}));

export default useStyles