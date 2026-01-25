import { Skeleton } from "@/shared/ui/components"
import { FlexContainer } from "../../../shared/ui/components";

const wrapperStyle = {
    display: 'flex',
    height: '3.5rem',
    width: '100%',
    padding: '.5rem 0',
    justifyContent: 'space-between',
    gap: '1rem',
    borderBottom: 'solid lightgrey 1px'
}

const circle = {
    maxWidth: '2.5rem',
    minWidth: '2.5rem',
    maxHeight: '2.5rem'
}

const line = {
    minHeight: '1rem',
    height: '1rem',
    alignSelf: 'center'
}



const NotificationSkeleton = () => {
    return (
        <FlexContainer style={wrapperStyle}>
            <Skeleton style={circle} width={40} height={40} radius="50%" />
            <Skeleton style={line} height={16} />
        </FlexContainer>
    )
}

export default NotificationSkeleton