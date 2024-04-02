import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  wrapper: {
    padding: '1.2rem 0',
    fontSize: '1rem',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    '& .author': {
      width: '100%',
      fontSize: '1.2rem',
      fontWeight: '500'
    },
    '& .panel': {
      gap: '1rem',
      height: '1.5rem',
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'start',
      alignItems: 'center',
      fontSize: '1.2rem'
    },
    '& .iconbox':{
      position: "relative"
    },
    '& .badge': {
      position: "absolute",
      maxHeight: "0.8rem",
      maxWidth:"0.8rem",
      left:"0.85rem",
      bottom:"1.15rem"
    },
    '& .text': {
      fontSize: '1rem',
      fontStyle: 'italic',
      padding: 0,
      margin: '0px'
    },
    '& .text p':{
      marginTop: '0.25rem'
    },
  },
  postinfo: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    fontSize: '14px',
    '& .likes': {
      marginRight: "auto"
    }
  },
})


export default styles