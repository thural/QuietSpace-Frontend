import { Container } from "@mantine/core";
import styles from "@/shared/styles/defaultContainerStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

const DefaultContainer: React.FC<GenericWrapper> = ({ forwardRef, size = "600px", children, ...props }) => {

    const classes = styles();

    return (
        <Container ref={forwardRef} className={classes.wrapper} size={size} {...props}>
            {children}
        </Container>
    )
}


export default DefaultContainer;