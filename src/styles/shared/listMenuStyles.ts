import { MenuListStyleProps } from "@/components/shared/ListMenu";
import { createUseStyles, Theme } from "react-jss";

// TODO: decouple and reuse by components

const styles = createUseStyles((theme: Theme) => (
	{
		menuIcon: (props: MenuListStyleProps) => ({
			fontSize: props?.iconSize || 'inherit',
			margin: '0',
			padding: '0',
			display: 'flex',
			cursor: 'pointer',
			position: 'relative',
			alignItems: 'center',
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
			zIndex: '1',
			margin: '0',
			bottom: '2rem',
			display: 'none',
			cursor: 'pointer',
			height: 'fit-content',
			boxSizing: 'border-box',
			backgroundColor: 'white',
			border: '1px solid #f1f1f1',
			width: props?.width || '10rem',
			color: theme.colors.textMax,
			borderRadius: props?.radius || theme.radius.md,
			boxShadow: theme.shadows.light,
			position: props?.position || 'absolute',
			fontSize: props?.fontSize || theme.typography.fontSize.secondary,
			fonstWeight: props?.fontWeight || '400',
			padding: props?.padding || theme.spacing(theme.spacingFactor.sm),
		})
	}
));


export default styles