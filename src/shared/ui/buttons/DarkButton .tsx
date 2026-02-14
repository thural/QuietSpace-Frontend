import { ReactNode } from 'react';
import { Button } from "@/shared/ui/components"
import { BaseClassComponent, IBaseComponentProps } from "@/shared/components/base/BaseClassComponent"

// Import the Button component type for proper ref typing
type ButtonComponent = InstanceType<typeof Button>;

/**
 * Props for DarkButton component
 */
export interface IDarkButtonProps extends IBaseComponentProps {
    forwardedRef?: React.RefObject<ButtonComponent> | ((instance: ButtonComponent | null) => void) | null;
    name?: string;
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
    radius?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    onClick?: (event: React.MouseEvent) => void;
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

        // Filter out undefined props to satisfy exactOptionalPropertyTypes
        const buttonProps: any = {
            variant,
            "data-testid": "dark-button",
            ...props
        };

        // Only add onClick if it's defined
        if (onClick !== undefined) {
            buttonProps.onClick = onClick;
        }

        // Only add ref if it's defined
        if (forwardedRef !== undefined && forwardedRef !== null) {
            buttonProps.ref = forwardedRef;
        }

        return (
            <Button {...buttonProps}>
                {name}
            </Button>
        );
    }
}

export default DarkButton;