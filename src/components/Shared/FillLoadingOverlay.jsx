import { LoadingOverlay } from "@mantine/core"

const FullLoadingOverlay = ({ visible = true, radius = "sm", blur = 2 }) => {

    return <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius, blur }} />
}

export default FullLoadingOverlay