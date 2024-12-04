import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({
  chatCard: (isSelected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row nowrap',
    justifyItems: 'flex-start',
    gap: theme.spacing(theme.spacingFactor.sm),
    padding: theme.spacing(theme.spacingFactor.sm),
    backgroundColor: isSelected ? theme.colors.background : theme.colors.backgroundSecondary,
    borderRadius: `${theme.radius.md} 0 0 ${theme.radius.md}`,
  }),
  chatCardAlt: {
    paddingLeft: '0',
    borderRadius: `${theme.radius.md} 0 0 ${theme.radius.md}`,
    marginLeft: theme.spacing(theme.spacingFactor.sm),
    padding: `${theme.spacing(theme.spacingFactor.xs)} 0`,
    backgroundColor: theme.colors.backgroundTransparent,
  },
  chatDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(theme.spacingFactor.xs),
    '& p': {
      lineHeight: '1rem',
      fontWeight: "inherit",
    }
  }
}));

export default styles