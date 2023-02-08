import { createUseStyles } from "react-jss"

const styles = createUseStyles(
	{
		app: {
			height: '100vh',
			margin: '0',
			display: 'grid',
			padding: '0',
			position: 'relative',
			gridTemplate: '1fr 9fr / 3fr 7fr',
			backgroundColor: 'whitesmoke'
		}
	}
);

export default styles
