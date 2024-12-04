import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({

  pollForm: {
    display: 'none',
    flexFlow: 'column nowrap',

    '& input:focus': {
      outline: 'none',
      borderColor: theme.colors.borderExtra,
    },

    '& input': {
      width: '100%',
      height: '2.5rem',
      boxSizing: 'border-box',
      fontWeight: theme.typography.fontWeightBold,
      padding: `0 ${theme.spacing(theme.spacingFactor.ms)}`,
      border: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.sm,
    },

    '& .close-poll': {
      cursor: 'pointer',
      fontSize: '.9rem',
      marginLeft: 'auto',
    },
  },
}));


export default styles
