import { createUseStyles } from "react-jss";

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
    flexFlow: 'column nowrap',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1em',
    backgroundColor: 'white',

    '& h3': {
      marginTop: '0',
      marginBottom: '1.2rem'
    },

    '& .control-area button': {
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
    '& .poll-toggle': {
      cursor: 'pointer',
    },
    '& .react-input-emoji--input': {
      padding: '0'
    },
    '& .react-input-emoji--container': {
      borderRadius: '21px',
      borderColor: 'black',
      border: 'none',
      fontSize: '15px',
      fontFamily: 'sans-serif',
      background: 'white',
      color: 'black'
    },
    '& .react-input-emoji--placeholder': {
      color: '#a0a0a0',
      pointerEvents: 'none',
      position: 'absolute',
      userSelect: 'none',
      zIndex: '2',
      left: '0',
      top: '0',
      bottom: '0',
      display: 'flex',
      alignItems: 'center',
      width: 'calc(100% - 22px)'
    }
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

  commentInput: {
    width: '100%',
    border: 'none',
    height: 'auto',
    resize: 'none',
    outline: 'none',
    padding: '10px',
    overflow: 'hidden',
    boxSizing: 'border-box',
    maxHeight: '200px',
    borderRadius: '4px',
    backgroundColor: 'transparent'
  },

  postCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  postContent: {
    maxWidth: '1000%',
    marginRight: '1rem'
  }

});


export default styles
