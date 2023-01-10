import { createUseStyles } from "react-jss"

const styles = createUseStyles(
	{
		menuOverlay: {
			position: "fixed",
			top: '0',
			right: '0',
			bottom: '0',
			left: '0',
			zIndex: '0',
			display: 'none',
		},
		menu: {
			top: '1rem',
			color: 'black',
			right: '1rem',
			width: '12rem',
			margin: '0px',
			display: 'none',
			zIndex: '1',
			position: 'fixed',
			fontSize: '1.4rem',
			boxShadow: 'rgb(0 0 0 / 25%) 0px 0px 96px 16px',
			boxSizing: 'border-box',
			borderRadius: '0.3rem',
			backgroundColor: 'white',
			'& a, a:hover, a:focus, a:active': {
				textDecoration: 'none',
				color: 'inherit',
			},
			'& li': {
				listStyle: "none",
			},
			'& .items': {
				padding: '1rem',
				width: '100%',
				margin: 'auto',
				overflow: 'auto',
				borderRadius: '1rem',
				backgroundColor: 'whitesmoke'
			},
			'& .item': {
				margin: '0',
				display: 'grid',
				alignItems: 'center',
				alignContent: 'center',
				justifyContent: 'center',
				gridTemplateColumns: '1fr 2fr'
			},
			'& .menu-item': {
				display: 'flex',
				flexFlow: 'row nowrap',
				justifyContent: 'space-between',
				padding: '.5rem 1rem'
			},
			'& .menu-item:not(:last-child)':{
				borderBottom: '#c5c5c5 solid 1px'
			},
			'& .image': {
				minWidth: '64px',
				minHeight: '64px',
				display: 'flex',
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
				margin: '0',
				padding: '0',
				alignSelf: 'center',
				fontWeight: '300',
			},
			'& h3': {
				fontSize: '2rem',
				marginTop: '1rem',
			},
			'& .buttons': {
				gap: '1rem',
				width: '100%',
				padding: '1rem 0',
				marginTop: 'auto'
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


export default styles
