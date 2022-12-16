import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	container : {
		height: "100%"
	},
	chat: {
		display: "flex"
	},
	contacts: {
		width: '100%',
		height: '100%',
		backgroundColor: 'amber',
		flexBasis: '200px',
		flexGrow: '1',
		flexShrink: '1'
	},
	messages: {
		padding: '0 5vw',
		width: '100%',
		flexBasis: 'min-content',
		flexGrow: '1',
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
		},
	},
})


export default styles
