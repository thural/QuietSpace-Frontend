import Typography from "@/components/shared/Typography";
import { ProcedureFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import FormStyled from "@/components/shared/FormStyled";
import LightButton from "@/components/shared/buttons/LightButton";

/**
 * SettingsPanelProps interface.
 * 
 * This interface defines the props for the SettingsPanel component.
 * 
 * @property {string} label - The label displayed at the top of the settings panel.
 * @property {boolean} isPending - Indicates whether a submission is in progress.
 * @property {ProcedureFn} handleSubmit - Function to be called when the submit button is clicked.
 */
interface SettingsPanelProps extends GenericWrapper {
    label: string;
    isPending: boolean;
    handleSubmit: ProcedureFn;
}

/**
 * SettingsPanel component.
 * 
 * This component renders a styled panel for settings, including a label, children components,
 * and a submit button. It indicates loading status through the button while a submission is in progress.
 * 
 * @param {SettingsPanelProps} props - The component props.
 * @returns {JSX.Element} - The rendered SettingsPanel component.
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({ label, isPending, handleSubmit, children }) => {
    return (
        <FormStyled style={{ gap: "2rem" }}> {/* Styled form container */}
            <Typography type="h3">{label}</Typography> {/* Display the label */}
            {children} {/* Render any child components passed to the SettingsPanel */}
            <LightButton
                loading={isPending} // Show loading state if submission is pending
                radius="10px" // Set button border radius
                variant="filled" // Button variant
                color="black" // Button color
                handleClick={handleSubmit} // Function to call on button click
                style={{ width: "8rem", height: "2.5rem", alignSelf: "flex-end" }} // Button styling
            />
        </FormStyled>
    );
}

export default SettingsPanel;