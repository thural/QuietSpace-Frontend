import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const styles = createUseStyles((theme: Theme) => ({
  message: {
    maxWidth: '200px',
    position: 'relative',
    display: 'flex',
    cursor: 'pointer',
    flexFlow: 'column nowrap',
    justifyItems: 'center',
    boxShadow: '0px 0px 16px -16px',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.backgroundTransparentMax,
    border: `${theme.colors.borderExtra} solid 1px`,
    padding: theme.spacing(theme.spacingFactor.md * 0.8),
    margin: `${theme.spacing(theme.spacingFactor.md * 0.3)} 0`,
    '& .buttons': {
      display: 'flex',
      marginLeft: 'auto',
      alignItems: 'center',
      flexFlow: 'row nowrap',
      gap: theme.spacing(theme.spacingFactor.xs),
    },
    '& button': {
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      padding: `${theme.spacing(theme.spacingFactor.xs)} ${theme.spacing(theme.spacingFactor.md)}`
    }
  },
  delete: {
    width: '100%',
    right: '2.5rem',
    cursor: 'pointer',
    position: 'absolute',
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeightThin,
    marginBottom: theme.spacing(theme.spacingFactor.md * 0.2)
  },
  text: {
    margin: '0',
    padding: '0',
    fontSize: '.9rem',
    fontWeight: '400',
    lineHeight: theme.typography.fontWeightThin,
    '& p': {
      margin: '0',
      padding: '0',
    }
  },
}))

export default styles
