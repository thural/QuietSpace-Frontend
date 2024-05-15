import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  commentSection: {
    fontSize: '1rem',
    marginTop: '12px',

    '& form': {
      width: '100%',
      display: 'flex',
      padding: '0',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      backgroundColor: '#e2e8f0',
    },

  },

  container: {
    margin: '.8rem 0 1.2rem 0',
    gap: '.5rem',
  },

  replyCard: {
    alignItems: 'center',
    '& .reply-card-indicator': {
      width: '.35rem',
      height: '2rem',
      borderRadius: '1rem 0rem 0rem 1rem',
      backgroundColor: 'orange'
    },

    '& .reply-card-text': {
      height: '2rem',
      borderRadius: '0 .5rem .5rem .0',
      backgroundColor: '#c5d3df',
      padding: '0 0.5rem'
    }

  },

  comment: {
    width: 'fit-content',
    padding: '10px 10px',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: '#e2e8f0',
    borderRadius: '1rem 1rem 1rem 0rem',

    '& .comment-text': {
      display: 'inline-block',
      margin: '0',
      padding: '0'
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

    '& .comment-options > *': {
      cursor: 'pointer',
    },
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
  avatar: {
    color: 'black',
    borderRadius: '10rem',
    alignSelf: 'flex-end'
  },
})


export default styles