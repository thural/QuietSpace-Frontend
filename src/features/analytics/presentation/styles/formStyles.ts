import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const styles = createUseStyles((theme: Theme) => ({
  form: {
    gap: theme.spacing(theme.spacingFactor.md),
    color: theme.colors.textMax,
    display: 'flex',
    padding: theme.spacing(theme.spacingFactor.md),
    margin: theme.spacing(theme.spacingFactor.md * 2),
    flexFlow: 'column nowrap',
    minWidth: '256px',
    boxShadow: theme.shadows.medium,
    borderRadius: theme.radius.ms,
    backgroundColor: theme.colors.background,
    '& .prompt': {
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: '1.1rem'
    },
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.borderExtra,
    },
  },
}));

export default styles
