import React from "react";
import { GenericWrapper } from "./types/sharedComponentTypes";

interface ComponentListProps extends GenericWrapper {
    Component: React.ComponentType<any>
    list: Array<Object>
}

const ComponentList: React.FC<ComponentListProps> = ({ Component, list, ...props }) => (
    list.map((elemData: Object, index: number) =>
        <Component key={index} data={elemData}  {...elemData} {...props} />)
);

export default ComponentList