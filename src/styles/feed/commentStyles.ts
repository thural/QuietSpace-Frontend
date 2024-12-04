import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({

  commentWrapper: {
    fontSize: '.9rem',
    gap: theme.spacing(theme.spacingFactor.md),
    margin: `${theme.spacing(theme.spacingFactor.ms)}, 0 ${theme.spacing(theme.spacingFactor.lg)} 0`,
    '& .right-section': {
      flexDirection: 'column',
      gap: theme.spacing(theme.spacingFactor.lg)
    }
  },

  mainElement: {
    display: 'flex',
    gap: theme.spacing(theme.spacingFactor.md),
  },

  commentElement: {
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: theme.spacing(theme.spacingFactor.md),
  },

  avatar: {
    alignSelf: 'flex-start',
    color: theme.colors.text,
    borderRadius: theme.radius.round,
  },

  textBody: {
    display: 'inline-block',
    margin: '0',
    padding: '0 10px',
    width: 'fit-content',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: theme.colors.background,
    borderRadius: '0rem 1rem 1rem 1rem'
  },

  replyCard: {
    alignItems: 'center',
    '& .reply-card-indicator': {
      width: '.35rem',
      height: '2rem',
      borderRadius: `${theme.radius.md} 0 0 ${theme.radius.md}`,
      backgroundColor: theme.colors.backgroundSecondary
    },
    '& .reply-card-text': {
      width: '100%',
      fontSize: '.9rem',
      height: '2rem',
      borderRadius: `0 ${theme.radius.sm} ${theme.radius.sm} 0`,
      backgroundColor: theme.colors.backgroundMax,
      padding: `0 ${theme.spacing(theme.spacingFactor.md)}`
    }

  },

  comment: {
    maxWidth: '50%',
    flexDirection: 'column',
    width: 'fit-content',
    position: 'relative',

    '& .comment-text': {
      display: 'inline-block',
      margin: '0',
      padding: '0'
    },
    '& .comment-options > *': {
      cursor: 'pointer',
    },
  },

  commentBody: {
    backgroundColor: theme.colors.background,
    boxSizing: 'border-box',
    borderRadius: `${theme.radius.md} 0 ${theme.radius.md} 0`,
    padding: '10px 10px',
  },

}));


export default styles