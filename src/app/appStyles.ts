import { createUseStyles } from "react-jss";
import { Theme } from "../shared/types/theme";

const styles = createUseStyles((theme: Theme) => (
	{
		app: {
			height: '100vh',
			backgroundColor: theme.colors.backgroundSecondary,
		}
	}
));

export default styles
