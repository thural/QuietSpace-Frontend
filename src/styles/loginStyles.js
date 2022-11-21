import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  login: {
    display: 'flex',
    flexFlow: 'column nowrap',
    backgroundColor: 'white',
    padding: '1rem',
    gap: '0.5rem',
    borderRadius: '1em',
    color: 'black',
    boxShadow: '4px 4px lightsteelblue',
    margin: 'auto',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '& button': {
      marginTop: '1rem',
      width: 'fit-content',
      backgroundColor: 'black',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '1rem',
      border: '1px solid black',
      fontSize: '1rem',
      fontWeight: '500',
    },
    '& .input': {
      display: 'flex',
      flexFlow: 'column nowrap',
      gap: '0.5rem',
    },
    '& input': {
      boxSizing: 'border-box',
      width: '100%',
      padding: '10px',
      height: '1.8rem',
      backgroundColor: '#e2e8f0',
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
