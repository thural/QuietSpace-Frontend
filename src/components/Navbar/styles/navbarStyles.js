import { createUseStyles } from "react-jss"

const styles = createUseStyles(
	{
		navbar: {
			top: '0',
			color: 'white',
			width: '100%',
			height: '4rem',
			margin: '0px',
			display: 'flex',
			padding: '0.5rem 1rem 0.5rem 1rem',
			zIndex: '2',
			position: 'fixed',
			flexWrap: 'nowrap',
			boxSizing: 'border-box',
			alignItems: 'center',
			fontWeight: '400',
			justifyContent: 'space-between',
			backgroundColor: 'rgba(255, 255,255,0.5)',
			backdropFilter: 'blur(8px)',
			WebkitBackdropFilter: 'blur(10px)',
			'& .navbar-item>a>img': {
				width: '100%',
				display: 'block',
				texAlign: 'center'
			},
			'& nav': {
				margin: '0',
				display: 'flex',
				padding: '0',
				alignItems: 'center',
				fontWeight: '500',
				justifyContent: 'center'
			},
			'& .navbar-item': {
				width: '2.5rem',
				margin: '0 1.8rem',
				display: 'flex',
				position: 'relative',
				alignItems: 'center',
				justifyContent: 'center'
			},
			'& .navbar-item > a > svg': {
				display: 'block',
				fontSize: '1.8rem',
				width: '2.5rem',
				margin: '0 1.8rem',
				color: 'black'
			},
			'& .navbar-item.menu': {
				margin: 'auto'
			},
			'& .title': {
				color: '#3e3e3e',
				margin: 'auto'
			},
			'& a, a:hover, a:focus, a:active': {
				textDecoration: 'none',
				color: 'inherit',
			},
			'& ul': {
				display: 'flex',
				fontSize: '1.6rem',
				alignItems: 'center',
				fontWeight: '400',
				justifyContent: 'center',
				margin: '0',
				padding: '0',
			},
			'& li:first-of-type': {
				marginLeft: 0
			},
			'& li': {
				listStyle: "none",
				margin: '0 1.5rem'
			}
		}
	}
);


export default styles
