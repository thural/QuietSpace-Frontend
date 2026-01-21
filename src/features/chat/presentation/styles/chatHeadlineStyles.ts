import { createUseStyles } from "react-jss";

const styles = createUseStyles({
  chatHeadline: {
    gap: '.8rem',
    position: 'relative',
    padding: '0 0.5rem 1rem .5rem',
    alignItems: 'center',
    '& .title': {
      width: '100%',
      position: 'relative',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1rem'
    },
  },
});

export default styles
