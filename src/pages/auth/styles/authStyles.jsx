import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  auth: {
    display: 'flex',
    flexFlow: 'row nowrap',
    background: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    '& .greeting-text': {
      display: 'flex',
      padding: '2rem',
      flexFlow: 'column nowrap',
      minWidth: 'min-content',
      // textAlign: 'center',
      alignItems: 'flex-start',
      // alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      fontSize: '3.2rem',
      alignSelf: 'center',
      gap: '3rem',
      height: '360px',
      textWrap: 'nowrap'
    },
    '& .brand': {
      marginTop: '0',
      minWidth: 'max-content',
      marginBottom: 'auto'
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
      background: 'white',
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
})


export default styles
