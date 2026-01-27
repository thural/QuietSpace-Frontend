import { createUseStyles } from "react-jss";
import { Theme } from "../types/theme";

const useStyles = createUseStyles((theme: Theme) => (
	{
		wrapper: {
			display: 'flex',
			alignItems: 'center',
			margin: `${theme.spacing(0.5)} 0`
		},
		roundedCheckbox: {
			width: '20px',
			height: '20px',
			appearance: 'none',
			backgroundColor: theme.colors.background,
			border: `1px solid ${theme.colors.border}`,
			borderRadius: theme.radius.round,
			outline: 'none',
			cursor: 'pointer',
			marginRight: '10px',
			position: 'relative',
			'&:checked': {
				backgroundColor: theme.colors.checkBox,
			},
			'&:checked::before': {
				content: '""',
				display: 'block',
				width: '10px',
				height: '10px',
				backgroundColor: theme.colors.checkBox,
				borderRadius: theme.radius.round,
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			}
		}
	}
));

export default useStyles;