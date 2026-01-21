import { createUseStyles } from "react-jss";

const styles = createUseStyles({
  inputSection: {
    zIndex: '1',
    marginTop: 'auto'
  },
  messageInput: {
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
  inputForm: {
    gap: '1rem',
    color: 'black',
    width: '100%',
    height: '100%',
    margin: 'auto',
    display: 'flex',
    flexFlow: 'row nowrap',
    // boxShadow: 'rgb(0 0 0 / 50%) 0px 0px 16px -4px',
    boxSizing: 'border-box',
    alignItems: 'center',
    backgroundColor: 'white',
    '& button': {
      color: 'white',
      width: 'fit-content',
      padding: '4px 8px',
      fontSize: '1rem',
      fontWeight: '500',
      display: 'flex',
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
