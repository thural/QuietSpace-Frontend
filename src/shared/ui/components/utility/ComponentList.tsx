import React, { PureComponent, ReactNode } from "react";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

interface IComponentListProps extends GenericWrapper {
    Component: React.ComponentType<any>;
    list: Array<Object>;
}

class ComponentList extends PureComponent<IComponentListProps> {
    override render(): ReactNode {
        const { Component, list, ...props } = this.props;

        return list.map((elemData: Object, index: number) =>
            <Component key={index} {...elemData} {...props} />
        );
    }
}

export default ComponentList;