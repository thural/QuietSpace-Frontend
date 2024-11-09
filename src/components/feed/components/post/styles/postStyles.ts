import { createUseStyles } from "react-jss"

const styles = createUseStyles({

  wrapper: {
    position: 'relative',
    padding: '0',
    paddingBottom: '1rem',
    fontSize: '1rem',
    margin: '1rem 0',

    '& .title': {
      width: '100%',
      position: 'relative',
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1rem'
    },

    '& .iconbox': {
      position: "relative"
    },

    '& .badge': {
      left: '0.85rem',
      bottom: '1.15rem',
      position: 'absolute',
      minWidth: '.8rem',
      maxHeight: '.8rem'
    },

    '& .text': {
      margin: '1rem 0',
      marginTop: '.5rem',
      padding: '0',
      fontSize: '1rem',
    },
    '& hr': {
      border: 'none',
      height: '0.5px',
      marginTop: '1rem',
      marginBottom: '0',
      backgroundColor: 'rgb(204 204 204)'
    }
  },

  controls: {
    gap: '.5rem',
    height: '1.5rem',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'start',
    alignItems: 'center',
    fontSize: '1.3rem',
    margin: '1rem 0'
  },

  postHeadline: {
    position: 'relative',
    gap: '.8rem'
  },

  postinfo: {
    opacity: '0.7',
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    fontSize: '14px',
    '& .likes': {
      marginRight: "auto"
    }
  },
})


export default styles