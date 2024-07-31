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
      gap: '1.25rem'
    },

    '& .control-area svg': {
      fontSize: '1.5rem'
    },

    '& .access-controls': {
      display: 'flex',
      alignItems: 'center',
      gap: '.3em',
      color: 'gray'
    },
    '& .poll-toggle':{
      cursor: 'pointer',
    }
  },

  pollView: {
    display: 'none',
    gap: '.225rem',
    flexFlow: 'column nowrap',

    '& input:focus': {
      outline: 'none',
      borderColor: '#a7abb1',
    },

    '& input': {
      width: '100%',
      height: '2.5rem',
      fontWeight: '500',
      padding: '0 0.75rem',
      boxSizing: 'border-box',
      border: '1px solid #e5e5e5',
      backgroundColor: '#fbfbfb',
      borderRadius: '10px',
    },

    '& .close-poll': {
      cursor: 'pointer',
      fontSize: '.9rem',
      marginLeft: 'auto',
      lineHeight: '0'
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
