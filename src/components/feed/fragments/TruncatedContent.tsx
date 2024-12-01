import FlexStyled from "@/components/shared/FlexStyled";
import useStyles from "@/styles/feed/commentFormStyles";
import { Text } from "@mantine/core";

interface TruncatedContentProps {
    text: string,
    truncate?: 'end' | 'start' | boolean,
    lineClamp?: number,
    Avatar: React.ReactNode
}

const TruncatedContent: React.FC<TruncatedContentProps> = ({ text, truncate, Avatar, lineClamp }) => {

    const classes = useStyles();

    return (
        <FlexStyled className={classes.card}>
            {Avatar}
            <Text
                className={classes.content}
                truncate={truncate} lineClamp={lineClamp}>{text}
            </Text>
        </FlexStyled>
    )
};

export default TruncatedContent