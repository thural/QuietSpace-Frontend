import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    margin: '0',
    width: '100%',
    height: '100%',
    flexFlow: 'column nowrap',
  },
}));

export default styles
