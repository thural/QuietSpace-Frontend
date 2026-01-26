import { createUseStyles } from "react-jss";
import { Theme } from "@shared-types/theme";

const styles = createUseStyles((theme: Theme) => (
	{
		navbar: {
			top: '0',
			zIndex: '4',
			width: '100%',
			margin: '0px',
			display: 'flex',
			position: 'fixed',
			flexWrap: 'nowrap',
			alignItems: 'center',
			boxSizing: 'border-box',
			backdropFilter: 'blur(8px)',
			color: theme.colors.textMax,
			justifyContent: 'space-between',
			WebkitBackdropFilter: 'blur(8px)',
			backgroundColor: theme.colors.backgroundTransparent,
			fontWeight: theme.typography.fontWeightThin,
			height: theme.spacing(theme.spacingFactor.md * 4),
			padding: `${theme.spacing(theme.spacingFactor.sm)} ${theme.spacing(theme.spacingFactor.md)}`,
			'& .badge': {
				position: 'absolute',
				backgroundColor: '#ff4848',
				height: theme.spacing(theme.spacingFactor.ms),
				width: theme.spacing(theme.spacingFactor.ms),
				left: theme.spacing(theme.spacingFactor.xl),
				bottom: theme.spacing(theme.spacingFactor.md),
			},
			'& .navbar-item>a>img': {
				width: '100%',
				display: 'block',
				texAlign: 'center'
			},
			'& nav': {
				margin: '0',
				padding: '0',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontWeight: theme.typography.fontWeightRegular,
			},
			'& .navbar-item': {
				display: 'flex',
				position: 'relative',
				alignItems: 'center',
				justifyContent: 'center',
				width: theme.spacing(theme.spacingFactor.md * 2.5),
				margin: `0 ${theme.spacing(theme.spacingFactor.md * 1.75)}`,
			},
			'& .navbar-item > a > svg': {
				display: 'block',
				color: theme.colors.textMax,
				width: theme.spacing(theme.spacingFactor.md * 2.5),
				fontSize: theme.spacing(theme.spacingFactor.md * 1.8),
				margin: `0 ${theme.spacing(theme.spacingFactor.md * 1.75)}`,
			},
			'& .navbar-item.menu': {
				margin: 'auto'
			},
			'& .title': {
				margin: 'auto',
				color: theme.colors.text,
			},
			'& a, a:hover, a:focus, a:active': {
				color: 'inherit',
				textDecoration: 'none',
			},
			'& ul': {
				margin: '0',
				padding: '0',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: theme.typography.fontSize.xLarge,
				fontWeight: theme.typography.fontWeightThin,
			},
			'& li:first-of-type': {
				marginLeft: 0
			},
			'& li': {
				listStyle: "none",
				margin: `0 ${theme.spacing(theme.spacingFactor.xl)}`,
			}
		}
	}
));


export default styles
