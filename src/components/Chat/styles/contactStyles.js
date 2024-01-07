import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  contact: {
    display: 'flex',
    padding: '.6rem 1rem',
    flexFlow: 'column nowrap',
    justifyItems: 'flex-start',
    backgroundColor: 'white'
  },
  author: {
    marginLeft: '0',
  },
  text: {
    fontSize: '15px',
    color: 'gray',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
    textOverflow: 'ellipsis',
    lineHeight: '0'
  }
})

export default styles
