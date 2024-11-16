import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		margin: '0.5rem 0'
	},
	roundedCheckbox: {
		width: '20px',
		height: '20px',
		appearance: 'none',
		backgroundColor: '#fff',
		border: '1px solid #a1a1a1',
		borderRadius: '50%',
		outline: 'none',
		cursor: 'pointer',
		marginRight: '10px',
		position: 'relative',
		'&:checked': {
			backgroundColor: 'blue',
		},
		'&:checked::before': {
			content: '""',
			display: 'block',
			width: '10px',
			height: '10px',
			backgroundColor: 'orange',
			borderRadius: '50%',
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		}
	}
});

export default useStyles;