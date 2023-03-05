import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  container: {
    height: "100%"
  },
  chat: {
    display: 'grid',
    gridRow: '2 / 4',
    gridColumn: '1 / 3',
    gridTemplateColumns: '3fr 7fr'
  },
  contacts: {
    display: 'flex',
    flexFlow: 'column nowrap',
    borderRight: '1px solid',
    gridColumn: '1/2'
  },
  messages: {
    padding: '0 10%',
    width: '100%',
    flexBasis: 'min-content',
    flexGrow: '1',
    '& .add-post-btn': {
      marginTop: '1rem',
      width: 'fit-content',
      backgroundColor: 'black',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '1rem',
      border: '1px solid black',
      fontSize: '1rem',
      fontWeight: '500',
      marginBottom: '1rem'
    },
  },
})


export default styles
