import { Skeleton } from "@mantine/core"
import FlexStyled from "./FlexStyled"

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
        <FlexStyled style={wrapperStyle}>
            <Skeleton style={circle} circle />
            <Skeleton style={line} />
        </FlexStyled >
    )
}

export default NotificationSkeleton