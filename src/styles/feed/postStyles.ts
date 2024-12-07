import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({

  postCard: {
    padding: '0',
    position: 'relative',
    fontSize: theme.typography.fontSize.primary,
    margin: `${theme.spacing(theme.spacingFactor.md)} 0`,

    '& .badge': {
      position: 'absolute',
      left: theme.spacing(theme.spacingFactor.md * 0.85),
      bottom: theme.spacing(theme.spacingFactor.md * 1.15),
      minWidth: theme.spacing(theme.spacingFactor.md * 0.8),
      maxHeight: theme.spacing(theme.spacingFactor.md * 0.8)
    },

    '& hr': {
      border: 'none',
      height: '0.1px',
      backgroundColor: theme.colors.hrDivider,
      marginTop: theme.spacing(theme.spacingFactor.md),
    },

    '&:not(:last-child)': { borderBottom: `.1px solid ${theme.colors.hrDivider}` },
  },
}));


export default styles