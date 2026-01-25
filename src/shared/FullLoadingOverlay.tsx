import { LoadingOverlay } from "@/shared/ui/components"

const FullLoadingOverlay = ({ visible = true, radius = "sm", blur = 2 }) => {

    return <LoadingOverlay visible={visible} />;
}

export default FullLoadingOverlay