import ErrorBoundary from "./hooks/ErrorBoundary";
import { Container } from "@mantine/core";
import styles from "./styles/defaultContainerStyles";
import { GenericWrapper } from "./types/sharedComponentTypes";

const DefaultContainer: React.FC<GenericWrapper> = ({ forwardRef, size = "600px", children, ...props }) => {

    const classes = styles();

    return (
        <ErrorBoundary >
            <Container ref={forwardRef} className={classes.wrapper} size={size} {...props}>
                {children}
            </Container>
        </ErrorBoundary>
    )
}

export default DefaultContainer