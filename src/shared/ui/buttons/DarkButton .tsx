import { ReactNode } from 'react';
import { Button } from "@/shared/ui/components"
import { BaseClassComponent, IBaseComponentProps } from "@/shared/components/base/BaseClassComponent"

/**
 * Props for DarkButton component
 */
export interface IDarkButtonProps extends IBaseComponentProps {
    forwardedRef?: React.Ref<HTMLButtonElement>;
    name?: string;
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
    radius?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

/**
 * State for DarkButton component
 */
interface IDarkButtonState {
    // No state needed for this component
}

/**
 * DarkButton component
 * 
 * A dark-themed button component converted to class-based pattern.
 * Provides consistent styling with customizable properties.
 */
export class DarkButton extends BaseClassComponent<IDarkButtonProps, IDarkButtonState> {
    protected override renderContent(): ReactNode {
        const {
            forwardedRef,
            name = "submit",
            variant = "dark",
            onClick,
            ...props
        } = this.props;

        return (
            <Button
                ref={forwardedRef}
                variant={variant}
                onClick={onClick}
                data-testid="dark-button"
                {...props}
            >
                {name}
            </Button>
        );
    }
}

export default DarkButton;