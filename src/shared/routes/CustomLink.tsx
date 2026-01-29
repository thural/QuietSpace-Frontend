
import { Link } from "react-router-dom";
import React, { PureComponent, ReactNode } from 'react';

export interface ICustomLinkProps {
    to: string;
    text?: string;
    Component?: ReactNode;
}

class CustomLink extends PureComponent<ICustomLinkProps> {
    render(): ReactNode {
        const { to, Component } = this.props;

        return (
            <Link to={to}>
                {Component}
            </Link>
        );
    }
}

export default CustomLink;