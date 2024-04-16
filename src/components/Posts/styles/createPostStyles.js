import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  wrapper: {
    gap: '.5rem',
    top: '50%',
    left: '50%',
    color: 'black',
    width: '600px',
    border: '1px solid gray',
    margin: 'auto',
    display: 'flex',
    padding: '1rem',
    zIndex: '3',
    position: 'fixed',
    flexFlow: 'row nowrap',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1em',
    backgroundColor: 'white',
    '& h3': {
      marginTop: '0',
      marginBottom: '1.2rem'
    },
    '& button': {
      color: 'white',
      border: '1px solid black',
      display: 'block',
      padding: '0 1rem',
      fontSize: '1rem',
      marginTop: '1rem',
      fontWeight: '500',
      marginLeft: 'auto',
      borderRadius: '3rem',
      backgroundColor: 'black'
    },
    '& input': {
      width: '100%',
      fontWeight: '600',
      border: 'none',
      height: '1.8rem',
      boxSizing: 'border-box',
      marginBottom: '0.5rem'
    },
    '& textarea': {
      width: '100%',
      height: '8rem',
      resize: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      border: 'none'
    },
    '& .input': {
      display: 'flex',
      flexFlow: 'column nowrap',
      gap: '0.5rem',
    },
    '& input:focus': {
      outline: 'none',
      borderColor: '#a7abb1',
    },
    '& form': {
      width: '100%'
    },
    '& .control-area': {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    '& .access-controls': {
      display: 'flex',
      alignItems: 'center',
      gap: '.3em',
      color: 'gray'
    },
  },
});


export default styles
