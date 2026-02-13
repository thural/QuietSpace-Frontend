import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"
import { MouseEventHandler, PureComponent, ReactNode } from "react"
import { Container } from '@/shared/ui/components/layout/Container';
import { MenuListStyleProps } from "./ListMenu";
import ClickableComponent from './ClickableComponent';

interface IClickableProps extends GenericWrapperWithRef {
    handleClick: MouseEventHandler<HTMLDivElement>;
    styleProps?: MenuListStyleProps;
    altText?: string;
    text: string;
    children?: ReactNode;
}

class Clickable extends PureComponent<IClickableProps> {
    /**
     * Handle click event
     */
    private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const { handleClick } = this.props;
        handleClick(e);
    };

    override render(): ReactNode {
        const {
            forwardedRef,
            altText = "",
            text,
            styleProps,
            children,
            ...props
        } = this.props;

        return (
            <ClickableComponent
                ref={forwardedRef}
                onClick={this.handleClick}
                fontSize={styleProps?.fontSize}
                fontWeight={styleProps?.fontWeight}
                padding={styleProps?.padding}
                {...props}
            >
                {text && <p>{text}</p>}
                {children}
            </ClickableComponent>
        );
    }
}

export default withForwardedRefAndErrBoundary(Clickable);