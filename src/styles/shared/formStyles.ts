import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({
  form: {
    gap: '1rem',
    margin: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
}));

export default styles
