import { GenericWrapper } from "@/types/sharedComponentTypes";
import React, { ChangeEvent, JSXElementConstructor } from "react";

interface HiddenFileInputProps extends GenericWrapper {
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
    Component: JSXElementConstructor<any>
}

const HiddenFileInput: React.FC<HiddenFileInputProps> = ({ onFileChange, Component }) => {

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            <Component onClick={handleClick} />
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onFileChange}
            />
        </div>
    );
};

export default HiddenFileInput;
