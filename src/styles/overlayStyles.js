import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	overlay: {
		display: 'block',
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
	}
})

export default styles
