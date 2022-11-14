import React, { useState, useContext } from "react";
import { createUseStyles } from "react-jss";
import cartImg from '../assets/cart.svg';
import HandlerContext from "./Handlers";

const useStyles = createUseStyles(
  {
    cartBtn: {
      width: '2rem',
      height: '2rem',
      zIndex: '1',
      backgroundColor: 'bisque',
      padding: '10px',
      borderRadius: '50px',
    },
    cartBadge: {
      top: '-25%',
      right: '50%',
      width: '75%',
      height: '75%',
      margin: '0',
      display: 'flex',
      padding: '0',
      position: 'relative',
      fontSize: '1rem',
      alignItems: 'center',
      borderRadius: '50%',
      justifyContent: 'center',
      verticalAlign: 'middle',
      lineHeight: '100%',
      backgroundColor: 'lightcoral'
    },
    cartBckg: {
      position: "fixed",
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      zIndex: '0',
      display: 'none',
    },
    cart: {
      top: '0',
      right: '0',
      bottom: '0',
      zIndex: '1',
      margin: '0px',
      color: 'black',
      width: '36vmax',
      padding: '1rem',
      display: 'none',
      fontSize: '16px',
      position: 'fixed',
      flexWrap: 'nowrap',
      justifyItems: 'center',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      gridTemplateRows: '1fr 7fr 1fr 1fr',
      boxShadow: 'rgb(0 0 0 / 25%) -16px 0px 32px 32px',
      '& a, a:hover, a:focus, a:active': {
        textDecoration: 'none',
        color: 'inherit',
      },
      '& li': {
        listStyle: "none",
      },
      '& .items': {
        gap: '1rem',
        width: '100%',
        margin: 'auto',
        display: 'grid',
        overflow: 'auto',
        maxHeight: '100%',
        minHeight: '50%',
        borderRadius: '1rem',
        gridAutoRows: '150px',
        justifyContent: 'space-around',
        backgroundColor: 'whitesmoke',
        gridTemplateColumns: '100%',
        boxShadow: 'inset rgb(0 0 0 / 25%) 0px 0px 16px 0px',
      },
      '& .item': {
        margin: '0',
        display: 'grid',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        gridTemplateColumns: '1fr 2fr'
      },
      '& .image': {
        minWidth: '64px',
        minHeight: '64px',
        display: 'flex',
      },
      '& img': {
        maxHeight: '64px',
        maxWidth: '64px',
        margin: 'auto',
      },
      '& .details': {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        gap: '1rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '& *': {
          marginTop: '0px',
          marginBottom: '0px',
        }
      },
      '& .counter': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '1rem'
      },
      '& p': {
        alignSelf: 'center',
        fontWeight: '600',
      },
      '& h3': {
        fontSize: '2rem',
        marginTop: '1rem',
      },
      '& .buttons': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        height: 'fit-content',
        gap: '1rem',
        marginTop: 'auto',
        marginBottom: '1rem'
      },
      '& .buttons button': {
        border: '1px solid lightgrey',
        padding: '1em',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: '0.5rem',
        backgroundColor: 'lightsalmon'
      },

    }
  }
);

const Cart = ({ cart: items}) => {
  const handleCart = useContext(HandlerContext)
  const classes = useStyles();

  const [display, setDisplay] = useState('none');

  const toggleDisplay = () => {
    if (display === "none") setDisplay("grid")
    else setDisplay("none");
  };

  const countItems = (items) => {
    const count = items
    .reduce((sum, {count}) => sum + count, 0);
    return String(count)
  };

  const calcTotal = (items) => {
    const total = items
    .reduce((sum, { price, count }) => sum + (price * count), 0);
    return String(Math.ceil(total * 10) / 10)
  };

  return (
    <>
      <div className={classes.cartBtn} onClick={toggleDisplay}>
        <img src={cartImg} ></img>
        <div className={classes.cartBadge}>{countItems(items)}</div>
      </div>
      <div className={classes.cartBckg} style={{ display: display }} onClick={toggleDisplay}></div>
      <div className={classes.cart} style={{ display: display }}>
        <h3>Shopping Cart</h3>
        <div className='items'>
          {items.map(({ id, image, title, count, price }) => (
            <div key={id} className='item'>
              <div className="image"><img src={image} /></div>
              <div className='details'>
                <h5>{title}</h5>
                <p>${(price * count)}</p>
                <div className='counter'>
                  <button onClick={() => handleCart({ id, type: 'decrement', count })}>-</button>
                  <p>{count}</p>
                  <button onClick={() => handleCart({ id, type: 'increment' })}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <h3>total: ${calcTotal(items)}</h3>
        <div className='buttons'>
          <button>checkout</button>
          <button onClick={toggleDisplay}>close</button>
        </div>
      </div>
    </>
  );
};

export default Cart;