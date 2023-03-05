import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  wrapper: {
    margin: 'auto',
    width: '100%',
    gridRow: '1 / 3',
    gridColumn: '1 / 3',
    '& .content': {
      display: 'flex',
      marginLeft: '25%',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'start'
    }
  },
  footer: {
    bottom: '0',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    gridColumn: '1 / 3',
    justifyContent: 'center',
    position: 'fixed',
    bottom: '0px',
    width: '100%',
    '& a, a:link, a:visited, a:hover, a:focus, a:active': {
      display: 'flex',
      gap: '1rem',
      color: 'black',
      textDecoration: 'inherit'
    }
  }
})

export default styles