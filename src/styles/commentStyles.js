import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	commentSection: {
		fontSize: '1rem',
		marginTop: '12px',
		'& .author': {
			width: '100%',
			fontSize: '1.2rem',
			fontWeight: '500'
		},
		'& form': {
			width: '100%',
			display: 'flex',
			padding: '0',
			boxSizing: 'border-box',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'transparent',
			borderRadius: '10px',
			backgroundColor: '#e2e8f0',
		},
		'& button': {
			color: 'white',
			border: '1px solid black',
			display: 'block',
			padding: '4px 8px',
			fontSize: '1rem',
			fontWeight: '400',
			marginLeft: 'auto',
			borderRadius: '1rem',
			backgroundColor: 'black',
			marginRight: '10px'
		},
	},
	comment: {
		width: 'fit-content',
		margin: '10px 0',
		padding: '10px 10px',
		boxSizing: 'border-box',
		alignItems: 'center',
		borderRadius: '10px',
		backgroundColor: '#e2e8f0',
		'& .comment-text': {
			margin: '0',
			padding: '0'
		},
		'& .comment-author': {
			margin: '0',
			fontSize: '14px',
			fontWeight: '600'
		}
	},
	commentInput: {
		width: '100%',
		border: 'none',
		height: 'auto',
		resize: 'none',
		outline: 'none',
		padding: '10px',
		overflow: 'hidden',
		boxSizing: 'border-box',
		maxHeight: '200px',
		borderRadius: '4px',
		backgroundColor: 'transparent'
	},
})


export default styles