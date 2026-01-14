import { MenuListStyleProps } from "@/shared/ListMenu";
import { createUseStyles, Theme } from "react-jss";

// TODO: decouple and reuse by components

const styles = createUseStyles((theme: Theme) => (
	{
		menuIcon: (props: MenuListStyleProps) => ({
			margin: '0',
			padding: '0',
			display: 'flex',
			cursor: 'pointer',
			position: 'relative',
			alignItems: 'center',
			fontSize: props?.iconSize || 'inherit',
		}),

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

		menuList: (props: MenuListStyleProps) => ({
			top: '0',
			right: '0',
			margin: '0',
			display: 'none',
			cursor: 'pointer',
			height: 'fit-content',
			boxSizing: 'border-box',
			color: theme.colors.textMax,
			zIndex: theme.zIndex.tooltip,
			width: props?.width || '10rem',
			boxShadow: theme.shadows.light,
			position: props?.position || 'absolute',
			fonstWeight: props?.fontWeight || '400',
			backgroundColor: theme.colors.background,
			border: `1px solid ${theme.colors.border}`,
			borderRadius: props?.radius || theme.radius.md,
			bottom: theme.spacing(theme.spacingFactor.md * 2),
			padding: props?.padding || theme.spacing(theme.spacingFactor.sm),
			fontSize: props?.fontSize || theme.typography.fontSize.secondary,
		})
	}
));


export default styles