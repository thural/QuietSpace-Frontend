import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  message: {
    maxWidth: '200px',
    position: 'relative',
    border: '#a1a1a1 solid 1px',
    margin: '.3rem 0',
    display: 'flex',
    padding: '0.8rem',
    cursor: 'pointer',
    flexFlow: 'column nowrap',
    borderRadius: '1rem',
    justifyItems: 'center',
    backgroundColor: 'white',
    boxShadow: '0px 0px 16px -16px',
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
  sender: {
    cursor: 'pointer',
    width: '100%',
    fontSize: '.7rem',
    fontWeight: '400',
    marginBottom: '0.2rem',
    color: '#404040',
    position: 'absolute',
    top: '-1.3rem',
  },
  delete: {
    cursor: 'pointer',
    color: '#404040',
    width: '100%',
    right: '2.5rem',
    position: 'absolute',
    fontSize: '.7rem',
    fontWeight: '400',
    marginBottom: '0.2rem'
  },
  text: {
    margin: '0px',
    padding: '0',
    fontSize: '.9rem',
    lineHeight: '1.4',
    fontWeight: '400',
    '& p': {
      margin: '0',
      padding: '0',
    }
  },
})

export default styles
