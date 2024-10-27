import React from "react";
import { GenericWrapper } from "./types/sharedComponentTypes";

interface ComponentListProps extends GenericWrapper {
    Component: React.ComponentType<any>
    list: Array<any>
}

const ComponentList: React.FC<ComponentListProps> = ({ Component, list, ...props }) => (
    list.map((elem: any, index: any) =>
        <Component key={index} data={elem} {...elem} {...props} />)
);

export default ComponentList