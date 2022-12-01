import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	wrapper: {
		margin: 'auto',
		padding: '10vw',
		'& .content': {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'flex-start'
		}
	},

})

export default styles
