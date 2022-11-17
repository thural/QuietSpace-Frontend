import React, { useContext} from "react";
import { createUseStyles } from "react-jss";

const useStyle = createUseStyles({
  overlay: {
    display: 'block',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  }
})
const Overlay = ({toggleComponent}) => {
  const classes = useStyle();

  return (
    <div className={classes.overlay} onClick={() => toggleComponent('overlay')}></div>
  )
};

export default Overlay;
