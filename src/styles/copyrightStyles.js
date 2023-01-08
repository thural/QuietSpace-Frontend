import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	footer: {
		gap: '1rem',
		color: 'black',
		bottom: '0',
		margin: '0',
		display: 'flex',
		padding: '1rem',
		boxSizing: 'border-box',
		alignItems: 'center',
		justifyContent: 'center',
		gridColumn: '1 / 3',
		'& a, a:link, a:visited, a:hover, a:focus, a:active': {
			display: 'flex',
			gap: '1rem',
			color: 'black',
			textDecoration: 'inherit'
		}
	}
})


export default styles
