import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  home: {
    display: 'flex',
    gridRow: '2 / 3',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    gridColumn: '1 / 3',
    justifyContent: 'center',
    padding: '1rem',
    '& .home-text': {
      minWidth: 'min-content',
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    },
    '& h1': {
      fontWeight: '500',
    },
    '& h3': {
      fontWeight: '300',
      fontStyle: 'italic',
      marginBottom: '6rem',
    },
    '& button': {
      fontSize: '2rem',
      backgroundColor: 'black',
      color: 'white',
      padding: '1rem 3rem',
      fontWeight: '600',
      border: '1px solid black',
      borderRadius: '3rem',
      width: 'max-content'
    }
  }
})


export default styles
