import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => (
	{
		menuOverlay: {
			top: '0',
			left: '0',
			right: '0',
			bottom: '0',
			zIndex: '0',
			width: '100vw',
			height: '100vh',
			display: 'none',
			position: 'fixed',
		},
		icon: {
			'& svg': {
				color: 'black',
				display: 'block',
				fontSize: theme.typography.fontSize.xLarge,
				width: theme.spacing(theme.spacingFactor.md * 2.5),
				margin: `0 ${theme.spacing(theme.spacingFactor.md * 1.8)}`,
			}
		},
		menuList: {
			top: '0',
			right: '0',
			zIndex: '1',
			margin: '0',
			color: 'black',
			width: '12rem',
			display: 'none',
			position: 'absolute',
			boxSizing: 'border-box',
			backgroundColor: 'white',
			fontSize: theme.typography.fontSize.xLarge,
			padding: theme.spacing(theme.spacingFactor.sm),
			borderRadius: theme.spacing(theme.spacingFactor.md),
			boxShadow: 'rgb(0 0 0 / 16%) 0px 0px 32px -4px',
			'& .clickable:hover': {
				margin: '0rem',
				boxSizing: 'border-box',
				padding: theme.radius.sm,
				borderRadius: theme.radius.sm,
				background: theme.colors.backgroundSecondary,
			},
			'& .clickable': {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: theme.spacing(theme.spacingFactor.sm),
			},
			'& a, a:hover, a:focus, a:active': {
				textDecoration: 'none',
				color: 'inherit',
			},
			'& p': {
				margin: '0',
				padding: '0',
				lineHeight: '0',
				alignSelf: 'center',
				fontWeight: theme.typography.fontWeightThin,
			}
		}
	}
));


export default styles