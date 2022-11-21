import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  wrapper: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent:'center',
    gap: '1rem',
    position: 'absolute',
    bottom:'0',
    margin: '0',
    padding: '1rem',
    textDecoration: 'none',
    color: 'black',
    textDecoration: 'inherit',
    fontWeight: 'inherit',
  },
  '& a, a:link, a:visited, a:hover, a:focus, a:active': {
    textDecoration: 'none',
    color: 'black',
    textDecoration: 'inherit',
    fontWeight: 'inherit',
  },

})


export default styles
