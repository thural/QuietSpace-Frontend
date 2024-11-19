import { createUseStyles } from "react-jss";

const styles = createUseStyles({
  wrapper: {
    gap: '1rem',
    color: 'black',
    display: 'flex',
    padding: '1rem',
    margin: '2rem',
    flexFlow: 'column nowrap',
    minWidth: '256px',
    boxShadow: 'rgb(0 0 0 / 16%) 0px 0px 32px -8px',
    borderRadius: '1rem',
    backgroundColor: 'white',
    '& .prompt': {
      fontWeight: '500',
      fontSize: '1.1rem'
    }
  },
});

export default styles
