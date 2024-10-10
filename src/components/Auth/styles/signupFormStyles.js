import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  signup: {
    gap: '0.5rem',
    color: 'black',
    display: 'flex',
    padding: '1rem',
    margin: '2rem',
    flexFlow: 'column nowrap',
    minWidth: '256px',
    boxShadow: 'rgb(0 0 0 / 16%) 0px 0px 32px -8px',
    borderRadius: '1em',
    backgroundColor: 'white',
    '& .button-custom': {
      marginLeft: 'auto',
      backgroundColor: 'black',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '1rem',
      fontSize: '1rem',
      fontWeight: '500',
    },
    '& .signup-form': {
      gap: '1rem',
      margin: '1rem 0',
      display: 'flex',
      flexFlow: 'column nowrap'
    },
    '& button': {
      fontSize: 'medium',
      marginTop: '.25rem'
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
      height: '2rem',
      backgroundColor: '#e2e8f0',
      border: '1px solid #e2e8f0',
      borderRadius: '10px'
    },
    '& input:focus': {
      outline: 'none',
      borderColor: '#a7abb1',
    },
    '& h1': {
      marginTop: '0'
    },
    '& h3': {
      marginBottom: '0'
    },
    '& .login-prompt': {
      marginTop: '.5rem',
      fontWeight: '500',
      fontSize: '1.1rem'
    }
  },
});

export default styles
