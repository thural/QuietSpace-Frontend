import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	wrapper: {
		padding: '1.2rem',
		fontSize: '1rem',
		boxShadow: '1px 1px 5px 1px rgba(72, 72, 72, 0.3)',
		borderRadius: '10px',
		backgroundColor: 'white',
		margin: '0 0 1.2rem 0',
		breakInside: 'avoid',
		pageBreakInside: 'avoid',
		'& .author': {
			width: '100%',
			fontSize: '1.2rem',
			fontWeight: '500'
		},
		'& .panel': {
			display: 'flex',
			height: '1.5rem',
			flexFlow: 'row nowrap',
			justifyContent: 'space-around'
		},
		'& .text': {
			fontSize: '1rem',
			fontStyle: 'italic',
			padding: 0,
			margin: '0px'
		},
		'& .buttons': {
			display: 'flex',
			flexFlow: 'row nowrap',
			alignItems: 'center',
			gap: '4px',
			marginLeft: 'auto'
		},
		'& button': {
			font: 'inherit',
			color: 'black',
			border: '1px solid black',
			cursor: 'pointer',
			outline: 'inherit',
			padding: '0.2rem 0.6rem',
			fontSize: '.85rem',
			borderRadius: '1rem',
			backgroundColor: 'white',
			marginLeft: 'auto'
		}
	},
	postinfo : {
		display: 'flex',
		justifyContent: 'flex-end',
		gap: '10px',
		fontSize: '14px',
		'& .likes': {
			marginRight: "auto"
		}
	},
})


export default styles