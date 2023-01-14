import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	chatboard: {
		width: '100%',
		margin: '0 10%',
		display: 'flex',
		flexFlow: 'column nowrap',
		flexGrow: '1',
		flexBasis: 'min-content',
		marginTop: '0',
		marginBottom: '0',
		'& .add-post-btn': {
			marginTop: '1rem',
			width: 'fit-content',
			backgroundColor: 'black',
			color: 'white',
			padding: '4px 8px',
			borderRadius: '1rem',
			border: '1px solid black',
			fontSize: '1rem',
			fontWeight: '500',
			marginBottom: '1rem'
		}
	},
	chatInput: {
		gap: '1rem',
		color: 'black',
		width: '100%',
		display: 'flex',
		padding: '1rem',
		flexFlow: 'row nowrap',
		marginTop: 'auto',
		alignItems: 'center',
		borderRadius: '1em',
		marginBottom: '1rem',
		backgroundColor: 'white',
		boxSizing: 'border-box',
		boxShadow: 'rgb(0 0 0 / 25%) 0px 16px 32px -8px',
		border: '1px solid gray',
		'& button': {
			color: 'white',
			width: 'fit-content',
			border: '1px solid black',
			padding: '4px 8px',
			fontSize: '1rem',
			fontWeight: '500',
			borderRadius: '1rem',
			backgroundColor: 'black'
		},
		'& .input': {
			display: 'flex',
			flexFlow: 'column nowrap',
			gap: '0.5rem',
		},
		'& input': {
			boxSizing: 'border-box',
			width: '100%',
			padding: '10px',
			height: '1.8rem',
			backgroundColor: '#e2e8f0',
			border: '1px solid #e2e8f0',
			borderRadius: '10px'
		},
		'& input:focus': {
			outline: 'none',
			borderColor: '#a7abb1',
		}
	},
});

export default styles
