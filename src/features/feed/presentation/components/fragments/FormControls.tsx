
import { Button, ActionButtons } from "../../styles/formControlStyles";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * Props for the FormControls component.
 * 
 * @interface FormControlsProps
 * @extends GenericWrapper
 * @property {boolean} isLoading - Indicates whether the form is currently submitting.
 * @property {boolean} isDisabled - Indicates whether the submit button should be disabled.
 * @property {ConsumerFn} handleSubmit - Function to handle the form submission.
 */
export interface FormControlsProps extends GenericWrapper {
    isLoading: boolean;
    isDisabled: boolean;
    handleSubmit: ConsumerFn;
}

/**
 * FormControls component.
 * 
 * This component provides a flexible area for form controls, including a submit button
 * and any additional children components. The submit button can be disabled and shows
 * a loading state when the form is submitting.
 * 
 * @param {FormControlsProps} props - The component props.
 * @returns {JSX.Element} - The rendered FormControls component.
 */
const FormControls: React.FC<FormControlsProps> = ({ isLoading, isDisabled, handleSubmit, children }) => {
    return (
        <ActionButtons>
            {children}
            <Button
                variant="primary"
                disabled={isDisabled || isLoading}
                onClick={handleSubmit}
            >
                {isLoading ? "Posting..." : "Post"}
            </Button>
        </ActionButtons>
    );
};

export default FormControls;