import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode, ChangeEvent, JSXElementConstructor, RefObject } from "react";

interface IHiddenFileInputProps extends GenericWrapper {
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    Component: JSXElementConstructor<any>;
}

class HiddenFileInput extends PureComponent<IHiddenFileInputProps> {
    private fileInputRef: RefObject<HTMLInputElement>;

    constructor(props: IHiddenFileInputProps) {
        super(props);
        this.fileInputRef = React.createRef<HTMLInputElement>();
        this.handleClick = this.handleClick.bind(this);
    }

    private handleClick = (): void => {
        if (this.fileInputRef.current) {
            this.fileInputRef.current.click();
        }
    };

    render(): ReactNode {
        const { onFileChange, Component } = this.props;

        return (
            <div>
                <Component onClick={this.handleClick} />
                <input
                    type="file"
                    ref={this.fileInputRef}
                    style={{ display: "none" }}
                    onChange={onFileChange}
                />
            </div>
        );
    }
}

export default HiddenFileInput;
