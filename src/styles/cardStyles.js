import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  wrapper: {
    border: 'grey solid 1px',
    display: 'grid',
    padding: '1rem',
    borderRadius: '1rem',
    justifyItems: 'center',
    backgroundColor: 'white',
    boxShadow: 'rgb(0 0 0 / 25%) -16px 0px 32px -8px',
    '& .author': {
      width: '100%',
      fontSize: '1.2rem',
      fontWeight: '500'
    },
    '& .message': {
      fontSize: '1rem',
      fontStyle: 'italic',
      padding: 0,
      margin: '0px'
    },
    '& .buttons': {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      gap: '4px',
      marginLeft: 'auto'
    },
    '& button': {
      color: 'white',
      backgroundColor: 'black',
      borderRadius: '1rem',
      padding: '0.2rem 0.6rem'
    }
  },
})


export default styles
