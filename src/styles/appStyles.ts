import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => (
	{
		app: {
			height: '100vh',
			backgroundColor: theme.colors.backgroundSecondary,
		}
	}
));

export default styles
