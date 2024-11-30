import Typography from "@/components/shared/Typography"
import { ProcedureFn } from "@/types/genericTypes"
import { GenericWrapper } from "@/types/sharedComponentTypes"
import FormStyled from "../shared/FormStyled"
import LightButton from "../shared/buttons/LightButton"

interface SettingsPanelProps extends GenericWrapper {
    label: string
    handleSubmit: ProcedureFn
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ label, handleSubmit, children }) => {


    return (
        <FormStyled style={{ gap: "2rem" }}>
            <Typography type="h3">{label}</Typography>
            {children}
            <LightButton
                radius="10px"
                variant="filled"
                color="black"
                handleClick={handleSubmit}
                style={{ width: "8rem", height: "2.5rem", alignSelf: "flex-end" }}
            />
        </FormStyled>
    )
}

export default SettingsPanel