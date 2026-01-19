import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({
  auth: {
    display: 'flex',
    flexFlow: 'row nowrap',
    background: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'inherit',
    '& .greeting-text': {
      display: 'flex',
      padding: theme.spacing(theme.spacingFactor.md * 2),
      flexFlow: 'column nowrap',
      minWidth: 'min-content',
      // textAlign: 'center',
      alignItems: 'flex-start',
      // alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      fontSize: '3.2rem',
      alignSelf: 'center',
      gap: theme.spacing(theme.spacingFactor.md * 3),
      height: '360px',
      textWrap: 'nowrap'
    },
    '& .brand': {
      marginTop: '0',
      minWidth: 'max-content',
      marginBottom: 'auto',
      fontFamily: 'inherit',
    },
    '& .primary-text': {
    },
    '& .secondary-text': {
      fontSize: '1.2rem',
      fontWeight: '300'
    },
  },
  '@media (max-width: 720px)': {
    auth: {
      background: theme.colors.background,
      flexDirection: 'column',
      justifyContent: 'space-around',
      '& .greeting-text': {
        alignItems: 'center',
        height: 'fit-content',
      },
      '& .brand': {
        fontSize: "2.5rem",
        marginBottom: '1rem'
      },
      '& .secondary-text': {
        display: 'none'
      },
    },
  },
}));


export default styles
