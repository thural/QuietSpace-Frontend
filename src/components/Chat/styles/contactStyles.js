import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  contact: {
    display: 'flex',
    padding: '.5rem',
    flexFlow: 'row nowrap',
    justifyItems: 'flex-start',
    alignItems: 'center',
    gap: '.5rem',
    backgroundColor: 'white',
    borderRadius: '1rem 0 0 1rem',
  },
  contactAlt: {
    backgroundColor: '#e8e8e8',
    paddingLeft: '0',
    marginLeft: '.5rem',
    borderRadius: '5rem 0 0 5rem',
    padding: '.25rem 0'
  },
  author: {
    marginLeft: '0',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.3rem',
    '& p': {
      fontWeight: "inherit",
      lineHeight: '1rem',
    }
  }
})

export default styles