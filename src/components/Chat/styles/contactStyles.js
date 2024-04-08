import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  contact: {
    display: 'flex',
    padding: '.5rem',
    flexFlow: 'row nowrap',
    justifyItems: 'flex-start',
    alignItems: 'center',
    gap: '.5rem',
    backgroundColor: 'rgb(227, 227, 227)',
    borderRadius: '1rem 0 0 1rem'
  },
  author: {
    marginLeft: '0',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.3rem',
    '& p':{
      lineHeight: '1rem',
    }
  }
})

export default styles
