import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({
  commentSection: {
    display: 'flex',
    flexFlow: 'column nowrap',
    fontSize: theme.typography.fontSize.primary,
    marginTop: theme.spacing(theme.spacingFactor.ms),
    '& .react-input-emoji--container': {
      fontSize: theme.typography.fontSize.primary,
      fontFamily: 'sans-serif',
      padding: '0',
      margin: theme.spacing(theme.spacingFactor.sm)
    },
    '& .react-input-emoji--button': {
      display: "flex",
      font: 'inherit',
      cursor: 'pointer',
      fontSize: theme.typography.fontSize.primary,
      marginLeft: '0',
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.background
    },
    '& .react-input-emoji--input': {
      margin: '0',
      padding: '0',
      fontWeight: theme.typography.fontWeightThin,
      maxHeight: '100px',
      minHeight: '20px',
      outline: 'none',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      zIndex: '1',
      width: '100%',
      userSelect: 'text',
      textAlign: 'left'
    },
    '& .react-input-emoji--placeholder': {
      left: '0',
      zIndex: '1'
    },
  },
  commentInput: {
    width: '100%',
    border: 'none',
    height: 'auto',
    resize: 'none',
    outline: 'none',
    padding: theme.spacing(theme.spacingFactor.ms),
    overflow: 'hidden',
    boxSizing: 'border-box',
    maxHeight: '200px',
    borderRadius: theme.radius.xs,
    backgroundColor: 'transparent'
  },
}))


export default styles