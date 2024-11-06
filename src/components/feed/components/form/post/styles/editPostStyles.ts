import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  post: {
    gap: '0',
    top: '50%',
    left: '50%',
    color: 'black',
    width: '640px',
    zIndex: '3',
    margin: 'auto',
    display: 'flex',
    padding: '1rem',
    position: 'fixed',
    flexFlow: 'column nowrap',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    backgroundColor: 'white',
    border: '1px solid gray',
    '& h3': {
      margin: 'auto',
      marginTop: '0',
      marginBottom: '0rem',
    },
    '& button': {
      color: 'white',
      width: '100%',
      border: '1px solid black',
      padding: '4px 8px',
      fontSize: '1rem',
      marginTop: '1rem',
      marginLeft: 'auto',
      fontWeight: '500',
      display: 'block',
      borderRadius: '1rem',
      backgroundColor: 'black',
    },
    '& textarea': {
      width: '100%',
      minHeight: '25vh',
      resize: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      padding: '.75rem',
      // backgroundColor: '#e2e8f0',
      border: '1px solid #e2e8f0',
      borderRadius: '1rem',
    },
    '& .title': {
      marginTop: '1rem',
      display: 'flex',
      flexFlow: 'column nowrap',
      gap: '0.5rem',
      fontSize: '1.2rem',
      fontWeight: '500',
      boxSizing: 'border-box',
      width: '100%',
      padding: '1rem',
      height: '1.8rem',
      margin: '.5rem 0',
      // backgroundColor: '#e2e8f0',
      border: '1px solid #e2e8f0',
      borderRadius: '10px'
    },
    '& input:focus': {
      outline: 'none',
      borderColor: '#a7abb1',
    }
  },
});


export default styles
