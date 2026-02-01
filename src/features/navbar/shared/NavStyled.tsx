import { ReactNode } from 'react';
import { BaseClassComponent, IBaseComponentProps } from '@/shared/components/base/BaseClassComponent';

/**
 * Props for NavStyled component
 */
interface INavStyledProps extends IBaseComponentProps {
    forwardedRef?: React.Ref<HTMLElement>;
}

/**
 * State for NavStyled component
 */
interface INavStyledState {
    // No state needed for this component
}

/**
 * NavStyled component
 * 
 * A simple navigation wrapper component converted to class-based pattern.
 * Provides a styled nav element with ref forwarding support.
 */
export class NavStyled extends BaseClassComponent<INavStyledProps, INavStyledState> {
    protected override renderContent(): ReactNode {
        const { forwardedRef, children, ...props } = this.props;

        return (
            <nav ref={forwardedRef} {...props} data-testid="nav-styled">
                {children}
            </nav>
        );
    }
}

export default NavStyled;