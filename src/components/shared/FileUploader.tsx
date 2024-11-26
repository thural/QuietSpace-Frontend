import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { formatFileSize } from "@/utils/stringUtils";
import { ChangeEvent, useState } from "react";
import BoxStyled from "./BoxStyled";
import OutlineButton from "./buttons/OutlineButton";
import InputStyled from "./InputStyled";
import Typography from "./Typography";


export type UploadStatus = "idle" | "uploading" | "error" | "success"

interface FileUploaderProps extends GenericWrapper {
    fetchCallback: ConsumerFn
}

export const FileUploader: React.FC<FileUploaderProps> = ({ fetchCallback }) => {

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
    }

    const handleFileUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            fetchCallback(formData);
            setStatus('success');
        } catch (e: unknown) {
            setStatus('error');
            alert(`error uploading file: ${(e as Error).message}`)
        }
    }

    const Container: React.FC<GenericWrapper> = ({ children }) => (
        <BoxStyled>
            <InputStyled type="file" onChange={handleFileChange} />
            <OutlineButton
                name="upload"
                disabled={!file}
                loading={status === "uploading"}
                onClick={handleFileUpload}
            />
            {children}
        </BoxStyled>
    );

    if (!file) return <Container />

    const fileSize = formatFileSize(file.size);

    return (
        <Container>
            <Typography>file name: {file.name}</Typography>
            <Typography>file size: {fileSize}</Typography>
            <Typography>file type: {file.type}</Typography>
        </Container>
    );
}