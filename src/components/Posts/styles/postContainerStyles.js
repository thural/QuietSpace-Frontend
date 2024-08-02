import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  container: {
    paddingTop: '4rem',
    '& hr': {
      border: 'none',
      height: '0.5px',
      backgroundColor: 'rgb(216 216 216)',
      marginTop: '1rem'
    }
  }
});

export default styles
