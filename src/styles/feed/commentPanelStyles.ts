import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  commentSection: {
    fontSize: '1rem',
    marginTop: '12px',
    '& .react-input-emoji--container': {
      fontSize: '1rem',
      fontFamily: 'sans-serif',
      padding: '0',
      margin: '8px'
    },
    '& .react-input-emoji--button': {
      display: "flex",
      font: 'inherit',
      cursor: 'pointer',
      fontSize: '1rem',
      marginLeft: '0',
      borderColor: 'white',
      borderRadius: '1rem',
      backgroundColor: 'white'
    },
    '& .react-input-emoji--input': {
      margin: '0',
      padding: '0',
      fontWeight: '400',
      maxHeight: '100px',
      minHeight: '20px',
      outline: 'none',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      zIndex: '1',
      width: '100%',
      userSelect: 'text',
      textAlign: 'left'
    },
    '& .react-input-emoji--placeholder': {
      left: '0',
      zIndex: '1'
    },
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
})


export default styles