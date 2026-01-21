import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const styles = createUseStyles((theme: Theme) => ({

  repostCard: {
    padding: '0',
    position: 'relative',
    alignItems: 'center',
    fontSize: theme.typography.fontSize.primary,
    margin: `${theme.spacing(theme.spacingFactor.md)} 0`,
    gap: theme.spacing(theme.spacingFactor.md * 0.8),
    '& hr': {
      border: 'none',
      height: '0.1px',
      backgroundColor: theme.colors.hrDivider,
      marginTop: theme.spacing(theme.spacingFactor.md),
    },

    '&:not(:last-child)': { borderBottom: `.1px solid ${theme.colors.hrDivider}` },
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
      fontSize: theme.typography.fontSize.large
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