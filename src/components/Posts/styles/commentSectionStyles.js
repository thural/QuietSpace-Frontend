import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  commentSection: {
    fontSize: '1rem',
    marginTop: '12px',
    '& .react-input-emoji--container': {
      borderRadius: '21px',
      borderColor: 'rgb(255, 255, 255)',
      fontSize: '15px',
      fontFamily: 'sans-serif',
      padding: '0',
      margin: '8px'
    },
    '& .react-input-emoji--button': {
      display: "flex",
      font: 'inherit',
      cursor: 'pointer',
      margin: '8px',
      padding: '8px 8px',
      fontSize: '1rem',
      marginLeft: '0',
      borderColor: 'white',
      borderRadius: '1rem',
      backgroundColor: 'white'
    },
    '& .react-input-emoji--input': {
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
      padding: '10px 16px',
      textAlign: 'left'
    },
    '& .author': {
      width: '100%',
      fontSize: '1.2rem',
      fontWeight: '500'
    },
    '& form': {
      width: '100%',
      display: 'flex',
      padding: '0',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      backgroundColor: '#e2e8f0',
    },
    '& .submit-btn': {
      color: 'white',
      border: '1px solid black',
      display: 'block',
      padding: '4px 8px',
      fontSize: '1rem',
      fontWeight: '400',
      marginLeft: 'auto',
      borderRadius: '1rem',
      backgroundColor: 'black',
      marginRight: '10px'
    },
  },
  comment: {
    width: 'fit-content',
    margin: '.8rem 0 1.6rem 0',
    padding: '10px 10px',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#e2e8f0',
    '& .comment-text': {
      margin: '0',
      padding: '0'
    },
    '& .comment-author': {
      margin: '0',
      fontSize: '14px',
      fontWeight: '600'
    },
    '& .comment-options': {
      width: '100%',
      gap: '10px',
      color: '#303030',
      left: '4px',
      bottom: '-2rem',
      display: 'flex',
      position: 'absolute',
      flexFlow: 'row nowrap',
      fontSize: '.8rem',
      fontWeight: '500',
    },
    emojiPicker: {
      height: '420px',
      width: '420px',
      position: 'relative',
      top: '37%',
      left: '0%'
    }
    // '& .comment-like': {
    // 	position: 'absolute',
    // 	bottom: '-2rem',
    // 	fontSize: '.85rem',
    // 	fontWeight: '500',
    // 	color: '#303030'
    // },
    // '& .comment-reply': {
    // 	position: 'absolute',
    // 	bottom: '-2rem',
    // 	left: '3rem',
    // 	fontSize: '.85rem',
    // 	fontWeight: '500',
    // 	color: '#303030'
    // },
    // '& .comment-delete': {
    // 	position: 'absolute',
    // 	bottom: '-2rem',
    // 	right: '0',
    // 	fontSize: '.85rem',
    // 	fontWeight: '500',
    // 	color: '#303030'
    // }
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