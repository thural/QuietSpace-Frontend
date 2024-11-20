import { createUseStyles } from "react-jss";

const styles = createUseStyles({

  pollForm: {
    display: 'none',
    flexFlow: 'column nowrap',

    '& input:focus': {
      outline: 'none',
      borderColor: '#a7abb1',
    },

    '& input': {
      width: '100%',
      height: '2.5rem',
      fontWeight: '500',
      padding: '0 0.75rem',
      boxSizing: 'border-box',
      border: '1px solid #e5e5e5',
      backgroundColor: '#fbfbfb',
      borderRadius: '10px',
    },

    '& .close-poll': {
      cursor: 'pointer',
      fontSize: '.9rem',
      marginLeft: 'auto',
    },
  },
});


export default styles
