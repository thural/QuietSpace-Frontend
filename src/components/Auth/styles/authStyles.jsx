import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  auth: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    zIndex: '6',
    position: 'fixed',
    flexFlow: 'row nowrap',
    background: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    '& .greeting-text': {
      display: 'flex',
      padding:'3rem',
      flexFlow: 'column nowrap',
      minWidth: 'min-content',
      textAlign: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      marginBottom: '50%',
      fontSize: '3.2rem'
    },
    '& .brand': {
      marginBottom: '50%',
      alignSelf: 'flex-start',
      fontSize: '3.2rem'
    },
    '& .primary-text': {
      fontWeight: '500',
      fontSize:'1.8rem'
    },
    '& .secondary-text': {
      fontStyle: 'italic',
      fontWeight: '300',
      marginBottom: '6rem',
      fontSize: '1.2rem'
    },
  }
})


export default styles
