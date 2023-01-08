import { createUseStyles } from "react-jss"

const styles = createUseStyles(
	{
		navbar: {
			gap: '1vw',
			top: '0',
			color: 'white',
			width: '100%',
			margin: '0px',
			display: 'flex',
			padding: '0.5rem 2.5rem 0.5rem 1rem',
			zIndex: '3',
			gridRow: '1 / 2',
			position: 'sticky',
			flexWrap: 'wrap',
			fontSize: '1.5rem',
			boxShadow: '0 4px 6px -4px rgba(72, 72, 72, 0.3)',
			boxSizing: 'border-box',
			alignItems: 'center',
			fontWeight: '400',
			gridColumn: '1 / 3',
			justifyContent: 'space-between',
			backgroundColor: 'black',
			'& nav': {
				margin: '0',
				marginLeft: 'auto',
				display: 'flex',
				padding: '0',
				fontSize: '1.5rem',
				alignItems: 'center',
				fontWeight: '500',
				justifyContent: 'center',
			},
			'& h1': {
				margin: '0',
				color: 'bisque'
			},
			'& a, a:hover, a:focus, a:active': {
				textDecoration: 'none',
				color: 'inherit',
			},
			'& ul': {
				display: 'flex',
				fontSize: '1.5rem',
				alignItems: 'center',
				fontWeight: '500',
				justifyContent: 'center',
				margin: '0',
				padding: '0',
			},
			'& li:first-of-type':{
				marginLeft: 0
			},
			'& li': {
				listStyle: "none",
				margin: '0 1rem'
			}
		}
	}
);


export default styles
