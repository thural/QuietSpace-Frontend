import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	wrapper: {
		margin: 'auto',
		padding: '10vw',
		gridColumn: '1 / 3',
		gridRow: '2 / 3',
		'& .content': {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'flex-start'
		}
	},

})

export default styles
