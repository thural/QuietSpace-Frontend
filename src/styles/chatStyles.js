import { createUseStyles } from "react-jss"

const styles = createUseStyles({
	posts: {
		margin: 'auto',
		padding: '10vh 10vw',
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
