import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"
import { MouseEventHandler } from "react"
import { Container } from '@/shared/ui/components/layout/Container';
import { MenuListStyleProps } from "./ListMenu";
import ClickableComponent from './ClickableComponent';

interface ClickableProps extends GenericWrapperWithRef {
    handleClick: MouseEventHandler<HTMLDivElement>,
    styleProps?: MenuListStyleProps,
    altText?: string,
    text: string
}

const Clickable: React.FC<ClickableProps> = ({
    forwardedRef,
    handleClick,
    altText = "",
    text,
    styleProps,
    children,
    ...props
}) => {
    return (
        <ClickableComponent
            ref={forwardedRef}
            onClick={(e) => handleClick(e)}
            fontSize={styleProps?.fontSize}
            fontWeight={styleProps?.fontWeight}
            padding={styleProps?.padding}
            {...props}
        >
            {text && <p>{text}</p>}
            {children}
        </ClickableComponent>
    )
}

export default withForwardedRefAndErrBoundary(Clickable)