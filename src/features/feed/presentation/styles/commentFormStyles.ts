import { createUseStyles, Theme } from "react-jss"

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