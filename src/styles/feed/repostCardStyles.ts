import { createUseStyles } from "react-jss"

const styles = createUseStyles({

  wrapper: {
    position: 'relative',
    padding: '0',
    fontSize: '1rem',
    margin: '1rem 0',
    alignItems: 'center',
    gap: '.8rem',
  },

  replytSection: {
    marginBottom: '0rem'
  },

  postHeadline: {
    fontSize: '1rem',
    position: 'relative',
    gap: '.8rem',
    alignItems: 'center',
    '& .repost-icon': {
      fontSize: '1.75rem'
    }
  },

  username: {
    fontSize: '2rem',
  },

  replyText: {
    fontWeight: '300',
    fontSize: '1rem',
  }
})


export default styles