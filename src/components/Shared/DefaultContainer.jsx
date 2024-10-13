import { Container } from "@mantine/core";
import ErrorBoundary from "./hooks/ErrorBoundary";
import styles from "./styles/defaultContainerStyles";

const DefaultContainer = ({ forwardRef, size = "600px", children, ...props }) => {

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