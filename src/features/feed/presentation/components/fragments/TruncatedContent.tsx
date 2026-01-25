import FlexStyled from "@/shared/FlexStyled";
import useStyles from "../comment/styles/commentFormStyles";
import { Text } from "@/shared/ui/components/typography/Text";

/**
 * Props for the TruncatedContent component.
 * 
 * @interface TruncatedContentProps
 * @property {string} text - The content text to be displayed.
 * @property {'end' | 'start' | boolean} [truncate] - Determines how the text should be truncated; 
 *        options include truncating at the end, start, or not at all.
 * @property {number} [lineClamp] - The number of lines to display before truncating.
 * @property {React.ReactNode} Avatar - The avatar element to display alongside the text.
 */
interface TruncatedContentProps {
    text: string;
    truncate?: 'end' | 'start' | boolean;
    lineClamp?: number;
    Avatar: React.ReactNode;
}

/**
 * TruncatedContent component.
 * 
 * This component displays a text alongside an avatar, with the ability to truncate the text
 * based on the specified props. It can limit the number of lines shown and specify whether
 * truncation occurs at the start or end of the text.
 * 
 * @param {TruncatedContentProps} props - The component props.
 * @returns {JSX.Element} - The rendered TruncatedContent component.
 */
const TruncatedContent: React.FC<TruncatedContentProps> = ({ text, truncate, Avatar, lineClamp }) => {
    const classes = useStyles();

    return (
        <FlexStyled className={classes.card}>
            {Avatar}
            <Text
                className={classes.content}
                truncate={truncate}
                lineClamp={lineClamp}>{text}
            </Text>
        </FlexStyled>
    );
};

export default TruncatedContent;