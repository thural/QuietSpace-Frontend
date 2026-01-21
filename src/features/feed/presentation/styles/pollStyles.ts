import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const styles = createUseStyles((theme: Theme) => ({
  pollContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: theme.spacing(theme.spacingFactor.sm),
    margin: `${theme.spacing(theme.spacingFactor.md)} 0`,
  },

  progressContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    borderRadius: theme.radius.md,
  },

  progress: {
    width: '100%',
    height: '2.75rem',
    borderRadius: 'inherit',
    backgroundColor: theme.colors.backgroundMax,
    boxShadow: theme.shadows.inset
  },

  progressBox: {
    width: '100%',
    borderRadius: theme.radius.md,
  },

  optionDesc: {
    zIndex: '1',
    position: 'absolute',
    fontSize: '.9rem',
    mixBlendMode: 'difference',
    left: theme.spacing(theme.spacingFactor.md),
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.colors.backgroundMax,
  },

  optionPerc: {
    zIndex: '1',
    color: 'white',
    fontSize: '.9rem',
    position: 'absolute',
    mixBlendMode: 'difference',
    right: theme.spacing(theme.spacingFactor.md),
    fontWeight: theme.typography.fontWeightRegular,
  },

  pollStatus: {
    gap: '10px',
    opacity: '0.7',
    display: 'flex',
    marginLeft: 'auto',
    justifyContent: 'flex-end',
    fontSize: theme.typography.fontSize.primary,
    '& .votes': {
      marginRight: "auto",
      fontSize: theme.typography.fontSize.small,
    }
  },
}));


export default styles
