import useFileUploader, { FetchCallback } from "@/services/hook/shared/useFileUploader";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { formatFileSize } from "@/shared/utils/stringUtils";
import BoxStyled from "./BoxStyled";
import OutlineButton from "./buttons/OutlineButton";
import InputStyled from "./InputStyled";
import Typography from "./Typography";

interface FileUploaderProps extends GenericWrapper {
    fetchCallback: FetchCallback
}

export const FileUploader: React.FC<FileUploaderProps> = ({ fetchCallback }) => {

    const {
        file,
        status,
        handleFileChange,
        handleFileUpload
    } = useFileUploader(fetchCallback)



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