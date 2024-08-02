import { createUseStyles } from "react-jss"

const styles = createUseStyles({

  container: {
    fontSize: '.9rem',
    margin: '.8rem 0 1.2rem 0',
    gap: '.5rem',
    '& .right-section': {
      flexDirection: 'column',
      gap: '1.2rem'
    }
  },

  mainElement: {
    display: 'flex',
    gap: '.5rem'
  },

  commentElement: {
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: '.5rem'
  },

  avatar: {
    color: 'black',
    borderRadius: '10rem',
    alignSelf: 'flex-start'
  },

  textBody: {
    width: 'fit-content',
    padding: '10px 10px',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: '#edeeef',
    borderRadius: '0rem 1rem 1rem 1rem',
    '& .comment-text': {
      display: 'inline-block',
      margin: '0',
      padding: '0'
    },
  },

  commentWrapper: {

  },

  commentOptions: {
    width: '100%',
    gap: '10px',
    color: '#303030',
    display: 'flex',
    flexFlow: 'row nowrap',
    fontSize: '.8rem',
    fontWeight: '500',
    '& > *': {
      cursor: 'pointer',
    },
    '& p': {
      margin: '0',
      fontSize: '.8rem',
      color: '#4d4d4d'
    }
  },

  commentInput: {
    width: '100%',
    border: 'none',
    height: 'auto',
    resize: 'none',
    outline: 'none',
    overflow: 'hidden',
    boxSizing: 'border-box',
    maxHeight: '200px',
    backgroundColor: 'transparent'
  },

})


export default styles