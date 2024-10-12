import LightButton from "../components/Shared/buttons/LightButton";

export default {
    title: "LightButton",
    component: LightButton,
    argTypes: { handleClick: { action: "handleClick" } }
}

export const Primary = {
    args: {
        primary: true,
        name: "primary button",
    }
}

export const Red = {
    args: {
        name: "red button",
        size: "2.5rem",
        color: "red"
    }
}