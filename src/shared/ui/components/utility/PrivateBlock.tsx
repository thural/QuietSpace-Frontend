import { CenterContainer } from "@/shared/ui/components/layout/CenterContainer";
import { RxLockClosed } from "react-icons/rx";
import FlexStyled from "@/shared/FlexStyled";
import Typography, { TypographyProps } from "@/shared/Typography";
import styles from "@/features/profile/presentation/styles/privateBlockStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';

/**
 * PrivateBlockProps interface.
 * 
 * This interface defines the props for the PrivateBlock component.
 * 
 * @property {string} message - The message to display in the private block.
 * @property {React.ComponentType} [Icon] - An optional icon component to display alongside the message.
 */
export interface IPrivateBlockProps extends TypographyProps, GenericWrapper {
    message: string;
    Icon?: React.ComponentType;
    children?: ReactNode;
}

/**
 * PrivateBlock component.
 * 
 * This component renders a styled block indicating private content. It displays a message, 
 * an optional icon, and can accommodate additional children components. The default icon 
 * is a lock symbol, representing privacy. The component is centered and styled for visual 
 * clarity.
 * 
 * @param {IPrivateBlockProps} props - The component props.
 * @returns {JSX.Element} - The rendered PrivateBlock component.
 */
class PrivateBlock extends PureComponent<IPrivateBlockProps> {
    override render(): ReactNode {
        const {
            message = "private content",
            Icon = RxLockClosed,
            type = "h4",
            children,
            ...props
        } = this.props;

        const classes = styles(); // Apply styles

        return (
            <CenterContainer {...props}> {/* Center the content */}
                <FlexStyled className={classes.privateBlock}>
                    <Icon className={classes.icon} /> {/* Render the icon */}
                    <FlexStyled className={classes.messageSection}>
                        <Typography className={classes.primaryMessage} type={type}>
                            {message} {/* Render the message */}
                        </Typography>
                        {children} {/* Render any additional children */}
                    </FlexStyled>
                </FlexStyled>
            </CenterContainer>
        );
    }
}

export default PrivateBlock;