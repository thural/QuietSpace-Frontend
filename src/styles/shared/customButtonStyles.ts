import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => (
  {
    wrapper: {
      color: theme.colors.background,
      marginLeft: 'auto',
      width: 'fit-content',
      border: '1px solid black',
      padding: '6px 12px',
      fontSize: theme.typography.fontSize.primary,
      marginTop: '1rem',
      fontWeight: '500',
      borderRadius: theme.radius.md,
      backgroundColor: 'black'
    }
  }));

export default styles
