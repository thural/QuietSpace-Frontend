import { createUseStyles } from "react-jss"

const styles = createUseStyles({

  wrapper: {
    position: 'relative',
    padding: '0',
    paddingBottom: '1rem',
    fontSize: '1rem',
    margin: '1rem 0',
    alignItems: 'center',
    gap: '.8rem',
    width: '100%'
  },

  replytSection: {
    marginBottom: '0rem'
  },

  postHeadline: {
    fontSize: '1rem',
    position: 'relative',
    gap: '.8rem',
    alignItems: 'center',
    '& .reply-icon': {
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