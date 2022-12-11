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
			top: '0',
			color: 'black',
			right: '0',
			width: '32vmax',
			margin: '0px',
			display: 'none',
			padding: '1rem',
			zIndex: '1',
			position: 'fixed',
			fontSize: '16px',
			boxShadow: 'rgb(0 0 0 / 25%) 0px 0px 64px 32px',
			boxSizing: 'border-box',
			backgroundColor: 'white',
			borderRadius: '0rem 0rem 0rem 0.5rem',
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
				alignSelf: 'center',
				fontWeight: '600',
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
