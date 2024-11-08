import { createUseStyles } from "react-jss";

const styles = createUseStyles({

  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
    top: '50%',
    left: '50%',
    color: 'black',
    width: '600px',
    border: '1px solid gray',
    margin: 'auto',
    padding: '1.5rem',
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

    '& input:focus': {
      outline: 'none',
      borderColor: '#a7abb1',
    },

  },

  '@media (max-width: 720px)': {
    wrapper: {
      gap: '.5rem',
      color: 'black',
      width: '100%',
      border: 'none',
      height: '100%',
      margin: 'auto',
      display: 'flex',
      padding: '1rem',
      zIndex: '3',
      position: 'fixed',
      flexFlow: 'row nowrap',
      borderRadius: 'unset',
      backgroundColor: 'white',
      '& form': {
        display: 'flex',
        flexFlow: 'column nowrap'
      },
      '& textarea': {
        height: '100%'
      },
      '& .control-area': {
        gap: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        marginTop: 'auto'
      },
    }
  },
});


export default styles
