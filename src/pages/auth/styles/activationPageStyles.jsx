import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  login: {
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
      color: 'white',
      marginLeft: 'auto',
      width: 'fit-content',
      border: '1px solid black',
      padding: '6px 12px',
      fontSize: '1rem',
      marginTop: '1rem',
      fontWeight: '500',
      borderRadius: '1rem',
      backgroundColor: 'black'
    },
    '& .button': {
      fontSize: 'medium'
    },
    '& form': {
      gap: '1rem',
      display: 'flex',
      flexFlow: 'column nowrap',
      margin: '1rem 0',
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
    '& .signup-prompt': {
      fontWeight: '500',
      fontSize: '1.1rem'
    }
  },
  '@media (max-width: 630px)': {
    login: {
      marginBottom: '10rem'
    },
  },
});


export default styles
