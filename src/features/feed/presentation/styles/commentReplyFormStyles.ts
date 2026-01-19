import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({

  wrapper: {
    display: 'flex',
    flexFlow: 'row no-wrap',
    gap: '.3rem'
  },

  inputWrapper: {
    position: 'relative',
    width: '16rem',
    background: theme.colors.background,
    borderRadius: '1rem',
    minHeight: '4rem',

    '& .react-emoji': {
      alignItems: 'normal',
    },

    '& .react-input-emoji--button': {
      width: '2.5rem',
      height: '2.5rem',
      margin: '.5rem 0',
      alignSelf: 'flex-start',
      background: theme.colors.background,
    },

    '& .react-input-emoji--container': {
      background: theme.colors.background,
      margin: '.25rem .75rem',
      border: 0
    },

    '& .react-input-emoji--wrapper': {
      background: theme.colors.background,
    }
  },

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
    backgroundColor: theme.colors.background,
    position: 'relative',
    top: '10rem',
    background: theme.colors.background,
  },
}))


export default styles