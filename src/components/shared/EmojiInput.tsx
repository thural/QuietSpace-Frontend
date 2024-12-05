import InputEmoji from "react-input-emoji";
import withForwardedRefAndErrBoundary from "@/services/hook/shared/withForwardedRef";
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { createUseStyles, Theme } from "react-jss";
import BoxStyled from "./BoxStyled";

export const styles = createUseStyles((theme: Theme) => ({
    emojiInputWrapper: {
        "& .react-input-emoji--container": {
            background: theme.colors.backgroundTransparentMax
        },
        "& .react-emoji-picker--wrapper": {
            position: 'absolute',
            top: '3rem',
            right: 0,
            height: '435px',
            width: '352px',
            overflow: 'hidden',
            zIndex: 10,
            backgroundColor: theme.colors.backgroundTransparentMax
        },
        '& .react-input-emoji--button': {
            color: theme.colors.textMax,
            right: '0rem',
            width: 'fit-content',
            display: 'flex',
            padding: theme.spacing(theme.spacingFactor.md),
            position: 'absolute',
            fontSize: '1rem',
            fontWeight: theme.typography.fontWeightRegular,
            zIndex: '1'
        },
    },
}));

const EmojiInput: React.FC<GenericWrapperWithRef> = ({
    forwardedRef,
    isEnabled = true,
    value,
    onChange,
    maxLength = "255",
    fontSize = 15,
    onEnter,
    theme = "light",
    borderColor = "white",
    ...props
}) => {

    const classes = styles();

    return (
        <BoxStyled className={classes.emojiInputWrapper}>
            <InputEmoji
                ref={forwardedRef}
                value={value}
                onChange={onChange}
                fontSize={fontSize}
                maxLength={maxLength}
                cleanOnEnter
                // buttonElement
                borderColor={borderColor}
                onEnter={onEnter}
                theme={theme}
                enabled={isEnabled}
                {...props}
            />
        </BoxStyled>
    );
}

export default withForwardedRefAndErrBoundary(EmojiInput)