import { createUseStyles } from "react-jss"

const styles = createUseStyles(
  {
    navbar: {
      gap: '1vw',
      top: '0',
      color: 'white',
      width: '100%',
      margin: '0px',
      display: 'flex',
      padding: '2vh 2rem',
      position: 'sticky',
      flexWrap: 'wrap',
      fontSize: '1.5rem',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: '400',
      backgroundColor: 'black',
      '& nav': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem'
      },
      '& h1': {
        margin: '0',
        color: 'bisque'
      },
      '& a, a:hover, a:focus, a:active': {
        textDecoration: 'none',
        color: 'inherit',
      },
      '& ul': {
        display: "flex",
        listStyle: "none",
        justifyContent: 'center',
        padding:'0',
        gap: '2rem',
        margin: '0',
      },
      '& li': {
        listStyle: "none",
      }
    }
  }
);


export default styles
