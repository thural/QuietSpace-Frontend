import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	wrapper: {
		display: 'flex',
		flexFlow: 'column nowrap',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '20vh',
		'& .home-text': {
			minWidth: 'min-content',
			display: 'flex',
			flexFlow: 'column nowrap',
			justifyContent: 'center',
			alignItems: 'center'
		},
		'& h1': {
			marginBottom: '6rem'
		},
		'& button': {
			fontSize: '2rem',
			backgroundColor: 'black',
			color: 'white',
			padding: '1rem 3rem',
			fontWeight: '600',
			border: '1px solid black',
			borderRadius: '3rem',
			width: 'max-content'
		}
	}
})


export default styles
