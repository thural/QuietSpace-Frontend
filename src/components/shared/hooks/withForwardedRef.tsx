import { forwardRef } from "react";

const withForwardedRef = (Component) => {
    return forwardRef((props, ref) => (
        <Component {...props} forwardedRef={ref} />
    ));
};

export default withForwardedRef