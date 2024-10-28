import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	overlay: {
		top: '0',
		left: '0',
		zIndex: '3',
		width: '100%',
		height: '100%',
		display: 'block',
		position: 'fixed',
		backdropFilter: 'blur(32px)',
		backgroundColor: 'rgba(128, 128, 128, 0.1)'
	}
})

export default styles