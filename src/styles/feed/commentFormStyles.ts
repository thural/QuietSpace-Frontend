import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  commentInput: {
    width: '100%',
    border: 'none',
    height: 'auto',
    resize: 'none',
    outline: 'none',
    padding: '10px',
    overflow: 'hidden',
    boxSizing: 'border-box',
    maxHeight: '200px',
    borderRadius: '4px',
    backgroundColor: 'transparent'
  },

  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  content: {
    maxWidth: '100%',
    marginRight: '1rem'
  },

  controls: {
    justifyContent: 'flex-end'
  }
});

export default styles