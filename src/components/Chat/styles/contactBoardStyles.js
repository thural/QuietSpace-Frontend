import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  contacts: {
    display: 'flex',
    flexFlow: 'column nowrap',
    borderRight: '1px solid',
    gridColumn: '1/2',
    maxWidth: "300px"
  }
});

export default styles
