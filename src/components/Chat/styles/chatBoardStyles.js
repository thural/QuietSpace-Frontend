import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  chatboard: {
    display: 'grid',
    overflow: 'hidden',
    marginTop: '0',
    gridColumn: '2/3',
    marginBottom: '0',
    gridTemplateRows: '7fr 1fr',
    '& .add-post-btn': {
      marginTop: '1rem',
      width: 'fit-content',
      backgroundColor: 'black',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '1rem',
      border: '1px solid black',
      fontSize: '1rem',
      fontWeight: '500',
      marginBottom: '1rem'
    }
  },
  messages: {
    display: 'flex',
    padding: '0 12%',
    gridRow: '1/2',
    overflow: 'auto',
    flexDirection: 'column-reverse',
  },
  inputSection: {
    zIndex: '1'
  },
  chatInput: {
    gap: '1rem',
    color: 'black',
    width: '100%',
    height: '100%',
    margin: 'auto',
    display: 'flex',
    padding: '1rem',
    flexFlow: 'row nowrap',
    boxShadow: 'rgb(0 0 0 / 50%) 0px 0px 16px -4px',
    boxSizing: 'border-box',
    alignItems: 'center',
    backgroundColor: 'white',
    '& button': {
      color: 'white',
      width: 'fit-content',
      border: '1px solid black',
      padding: '4px 8px',
      fontSize: '1rem',
      fontWeight: '500',
      borderRadius: '1rem',
      backgroundColor: 'black'
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
