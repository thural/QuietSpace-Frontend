import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  cardboard: {
    gap: '24px',
    width: '100%',
    margin: 'auto',
    display: 'grid',
    gridTemplateRows: 'repeat( auto-fit, minmax(12rem, 1fr) )',
    gridTemplateColumns: 'repeat( auto-fit, minmax(12rem, 1fr) )'
  }
});

export default styles
