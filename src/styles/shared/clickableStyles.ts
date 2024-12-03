import { MenuListStyleProps } from "@/components/shared/ListMenu";
import { createUseStyles, Theme } from "react-jss";

const useStyles = createUseStyles((theme: Theme) => (
    {
        clickable: (props: MenuListStyleProps) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: props?.fontSize || 'inherit',
            fontWeight: props?.fontWeight || 'inherit',
            padding: `${props?.padding || theme.spacing((theme.spacingFactor.sm))} 
            ${theme.spacing((theme.spacingFactor.sm))}`,
            height: theme.spacing((theme.spacingFactor.md * 2)),

            '&:hover': {
                background: theme.colors.backgroundSecondary,
                borderRadius: theme.radius.sm,
                boxSizing: 'border-box'
            },

            '& a, a:hover, a:focus, a:active': {
                color: 'inherit',
                textDecoration: 'none',
            },

            '& p': {
                margin: '0',
                padding: '0',
                lineHeight: '0',
                alignSelf: 'center',
            }
        })
    }
));

export default useStyles