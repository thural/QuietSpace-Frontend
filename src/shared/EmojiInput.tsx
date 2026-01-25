import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import InputEmoji from "react-input-emoji";
import { createUseStyles } from "react-jss";
import { Theme } from "./types/theme";
import { Container } from '@/shared/ui/components/layout/Container';

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
    theme,
    ...props
}) => {

    const classes = styles();


    return (
        <Container className={classes.emojiInputWrapper}>
            <InputEmoji
                ref={forwardedRef}
                value={value}
                onChange={onChange}
                fontSize={fontSize}
                maxLength={maxLength}
                cleanOnEnter
                // buttonElement
                background={"transparent"}
                onEnter={onEnter}
                theme={"auto"}
                shouldReturn={true}
                shouldConvertEmojiToImage={false}
                {...props}
            />
        </Container>
    );
}

export default withForwardedRefAndErrBoundary(EmojiInput)