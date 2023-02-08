import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	posts: {
		flexGrow: '1',
		gridColumn: '1 / 3',
		gridRow: '2 / 3',
		padding: '1vh 10vw',
		overflow: 'auto',
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
	}
})

export default styles
