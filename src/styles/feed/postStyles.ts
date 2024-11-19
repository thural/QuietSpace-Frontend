import { createUseStyles } from "react-jss"

const styles = createUseStyles({

  postCard: {
    position: 'relative',
    padding: '0',
    fontSize: '1rem',
    margin: '1rem 0',

    '& .badge': {
      left: '0.85rem',
      bottom: '1.15rem',
      position: 'absolute',
      minWidth: '.8rem',
      maxHeight: '.8rem'
    },
    '& hr': {
      border: 'none',
      height: '0.5px',
      marginTop: '1rem',
      marginBottom: '0',
      backgroundColor: 'rgb(204 204 204)'
    }
  },
})


export default styles