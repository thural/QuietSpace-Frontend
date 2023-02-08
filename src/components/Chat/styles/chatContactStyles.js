import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	contact: {
		display: 'flex',
		flexFlow: 'column nowrap',
		padding: '1rem',
		justifyItems: 'flex-start',
		backgroundColor: 'white',
	},
	author: {
		marginLeft: '0',
	},
	text: {
		fontSize: '15px',
		color: 'gray',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		display: 'block',
		textOverflow: 'ellipsis',
		lineHeight: '0'
	}
})

export default styles
