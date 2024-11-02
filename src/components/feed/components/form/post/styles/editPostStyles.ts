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
      marginTop: '0',
      marginBottom: '1rem'
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
      height: '240px',
      resize: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      padding: '.75rem',
      backgroundColor: '#e2e8f0',
      border: '1px solid #e2e8f0',
      borderRadius: '1rem',
    },
    // '& .input': {
    //   display: 'flex',
    //   flexFlow: 'column nowrap',
    //   gap: '0.5rem',
    //   padding: '.5rem'
    // },
    // '& input': {
    //   boxSizing: 'border-box',
    //   width: '100%',
    //   padding: '10px',
    //   height: '1.8rem',
    //   backgroundColor: '#e2e8f0',
    //   border: '1px solid #e2e8f0',
    //   borderRadius: '10px'
    // },
    '& input:focus': {
      outline: 'none',
      borderColor: '#a7abb1',
    }
  },
});


export default styles
