import { createUseStyles } from "react-jss"

const styles = createUseStyles(
	{
		menuOverlay: {
			top: '0',
			left: '0',
			right: '0',
			bottom: '0',
			display: 'none',
			zIndex: '0',
			position: 'fixed',
			width: '100vw',
			height: '100vh'
		},
		icon: {
			'& svg': {
				display: 'block',
				fontSize: '1.8rem',
				width: '2.5rem',
				margin: '0 1.8rem',
				color: 'black'
			}
		},
		menuList: {
			top: '1rem',
			color: 'black',
			right: '1rem',
			width: '12rem',
			margin: '0',
			display: 'none',
			zIndex: '1',
			position: 'fixed',
			fontSize: '1.4rem',
			boxShadow: 'rgb(0 0 0 / 25%) 0px 0px 32px -4px',
			boxSizing: 'border-box',
			borderRadius: '1rem',
			backgroundColor: 'white',
			padding: '.5rem',
			'& .clickable:hover': {
				margin: '0rem',
				background: 'var(--mantine-color-gray-1)',
				borderRadius: '1rem',
				padding: '.5rem',
				boxSizing: 'border-box'
			},
			'& .clickable': {
				padding: '.5rem',
				display: 'flex',
				fontSize: '1.8rem',
				alignItems: 'center',
				justifyContent: 'space-between'
			},
			'& a, a:hover, a:focus, a:active': {
				textDecoration: 'none',
				color: 'inherit',
			},
			'& p': {
				margin: '0',
				padding: '0',
				alignSelf: 'center',
				fontWeight: '300',
				lineHeight: '0'
			}
		}
	}
);


export default styles