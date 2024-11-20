import { createUseStyles } from "react-jss"

const styles = createUseStyles({

  commentWrapper: {
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
    display: 'inline-block',
    margin: '0',
    padding: '0 10px',
    width: 'fit-content',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: '#edeeef',
    borderRadius: '0rem 1rem 1rem 1rem'
  },

  replyCard: {
    alignItems: 'center',
    '& .reply-card-indicator': {
      width: '.35rem',
      height: '2rem',
      borderRadius: '1rem 0rem 0rem 1rem',
      backgroundColor: '#000000'
    },
    '& .reply-card-text': {
      width: '100%',
      fontSize: '.9rem',
      height: '2rem',
      borderRadius: '0 .5rem .5rem .0',
      backgroundColor: '#dbe2e8',
      padding: '0 0.5rem'
    }

  },

  comment: {
    maxWidth: '50%',
    flexDirection: 'column',
    width: 'fit-content',
    position: 'relative',

    '& .comment-text': {
      display: 'inline-block',
      margin: '0',
      padding: '0'
    },
    '& .comment-options > *': {
      cursor: 'pointer',
    },
  },

  commentBody: {
    backgroundColor: '#F0F2F4',
    boxSizing: 'border-box',
    borderRadius: '1rem 0rem 1rem 0rem',
    padding: '10px 10px',
  },

});


export default styles