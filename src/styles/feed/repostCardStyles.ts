import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({

  repostCard: {
    padding: '0',
    position: 'relative',
    alignItems: 'center',
    fontSize: theme.typography.fontSize.primary,
    margin: `${theme.spacing(theme.spacingFactor.md)} 0`,
    gap: theme.spacing(theme.spacingFactor.md * 0.8),
  },

  replytSection: {
    marginBottom: '0rem'
  },

  postHeadline: {
    position: 'relative',
    alignItems: 'center',
    fontSize: theme.typography.fontSize.primary,
    gap: theme.spacing(theme.spacingFactor.xs),
    '& .repost-icon': {
      fontSize: '1.5rem'
    }
  },

  username: {
    fontSize: theme.typography.fontSize.large,
  },

  replyText: {
    fontWeight: theme.typography.fontWeightThin,
    fontSize: theme.typography.fontSize.primary,
  }
}));


export default styles