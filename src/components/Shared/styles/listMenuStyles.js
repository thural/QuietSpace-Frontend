import { createUseStyles } from "react-jss";

const styles = createUseStyles(
	{
		menuIcon: {
			position: 'relative',
			cursor: 'pointer',
			alignItems: 'center',
			display: 'flex',
			margin: '0',
			padding: '0'
		},

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

		menuList: {
			height: 'fit-content',
			top: '0',
			color: 'black',
			cursor: 'pointer',
			right: '0',
			width: '10rem',
			border: '1px solid #f1f1f1',
			bottom: '2rem',
			margin: '0',
			display: 'none',
			padding: '.5rem',
			zIndex: '1',
			position: 'absolute',
			fontSize: '1.4rem',
			boxShadow: 'rgb(0 0 0 / 16%) 0px 0px 24px -6px',
			boxSizing: 'border-box',
			borderRadius: '1rem',
			backgroundColor: 'white',

			'& .clickable': {
				height: '2rem',
				padding: '.5rem',
				display: 'flex',
				fontSize: '1.5rem',
				alignItems: 'center',
				justifyContent: 'space-between'
			},

			'& .clickable:hover': {
				margin: '0rem',
				background: 'var(--mantine-color-gray-1)',
				borderRadius: '1rem',
				padding: '.5rem',
				boxSizing: 'border-box'
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