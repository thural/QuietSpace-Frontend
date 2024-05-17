import { createUseStyles } from "react-jss"

const styles = createUseStyles({

  wrapper: {
    position: 'relative',
    width: '16rem',
    background: '#F0F2F4',
    borderRadius: '1rem',
    minHeight: '4rem',

    '& .react-emoji':{
      alignItems: 'normal',
    },

    '& .react-input-emoji--button':{
      width: '2.5rem',
      height: '2.5rem',
      margin: '.5rem 0',
      alignSelf: 'flex-start',
      background: '#F0F2F4 !important'
    },

    '& .react-input-emoji--container':{
      background: '#F0F2F4 !important',
      margin: '.25rem .75rem',
      border: 0
    },

    '& .react-input-emoji--wrapper':{
      background: '#F0F2F4'
    }
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
    backgroundColor: 'transparent',
    position: 'relative',
    top: '10rem',
    background: 'blue'
  },
})


export default styles