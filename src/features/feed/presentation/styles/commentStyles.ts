import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const styles = createUseStyles((theme: Theme) => ({

  commentWrapper: (isReply: boolean) => ({
    display: 'flex',
    marginLeft: isReply ? 'auto' : '0',
    fontSize: '.9rem',
    gap: theme.spacing(theme.spacingFactor.md),
    margin: `${theme.spacing(theme.spacingFactor.ms)} 0 ${theme.spacing(theme.spacingFactor.lg)} 0`,
    '& .right-section': {
      flexDirection: 'column',
      gap: theme.spacing(theme.spacingFactor.lg)
    }
  }),

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
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '0rem 1rem 1rem 1rem'
  },

  replyCard: {
    alignItems: 'center',
    '& .reply-card-indicator': {
      width: '.35rem',
      height: '2rem',
      borderRadius: `${theme.radius.md} 0 0 ${theme.radius.md}`,
      backgroundColor: theme.colors.secondary
    },
    '& .reply-card-text': {
      width: '100%',
      fontSize: '.9rem',
      height: '2rem',
      borderRadius: `0 ${theme.radius.sm} ${theme.radius.sm} 0`,
      backgroundColor: theme.colors.background,
      padding: `0 ${theme.spacing(theme.spacingFactor.md)}`
    }

  },

  comment: {
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
    backgroundColor: theme.colors.backgroundSecondary,
    boxSizing: 'border-box',
    borderRadius: `${theme.radius.md} 0 ${theme.radius.md} 0`,
    padding: '10px 10px',
  },

}));


export default styles