import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	message: {
		width: '200px',
		border: 'grey solid 1px',
		display: 'flex',
		padding: '1rem',
		flexFlow: 'column nowrap',
		maxWidth: '70%',
		boxShadow: 'rgb(0 0 0 / 25%) -16px 0px 32px -8px',
		borderRadius: '1rem',
		justifyItems: 'center',
		backgroundColor: 'white',
		marginTop: '1rem',
		'& .buttons': {
			display: 'flex',
			flexFlow: 'row nowrap',
			alignItems: 'center',
			gap: '4px',
			marginLeft: 'auto'
		},
		'& button': {
			color: 'white',
			backgroundColor: 'black',
			borderRadius: '1rem',
			padding: '0.2rem 0.6rem'
		}
	},
	sender: {
		width: '100%',
		fontSize: '1.2rem',
		fontWeight: '500',
		marginBottom: '0.5rem'
	},
	text: {
		fontSize: '1rem',
		padding: 0,
		margin: '0px',
		lineHeight: '1.3',
		'& p': {
			margin: '0',
			padding: '0',
		}
	},
})

export default styles
