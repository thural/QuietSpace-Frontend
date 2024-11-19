import { createUseStyles } from "react-jss";

const styles = createUseStyles({

  button: {
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

  controlArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    '& svg': {
      fontSize: '1.5rem'
    },
  },

  accessControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '.3em',
    color: 'gray'
  },

  pollToggle: {
    cursor: 'pointer',
  },

  '@media (max-width: 720px)': {
    form: {
      display: 'flex',
      flexFlow: 'column nowrap'
    },
    controlArea: {
      display: 'flex',
      gap: '1.25rem',
      alignItems: 'center',
      marginTop: 'auto'
    },
  }

});


export default styles
