import useFileUploader, { FetchCallback } from "@/services/hook/shared/useFileUploader";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { formatFileSize } from "@/shared/utils/stringUtils";
import { Container } from '@/shared/ui/components/layout/Container';
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



    const ContainerComponent: React.FC<GenericWrapper> = ({ children }) => (
        <Container>
            <InputStyled type="file" onChange={handleFileChange} />
            <OutlineButton
                name="upload"
                disabled={!file}
                loading={status === "uploading"}
                onClick={handleFileUpload}
            />
            {children}
        </Container>
    );

    if (!file) return <ContainerComponent />

    const fileSize = formatFileSize(file.size);


    return (
        <ContainerComponent>
            <Typography>file name: {file.name}</Typography>
            <Typography>file size: {fileSize}</Typography>
            <Typography>file type: {file.type}</Typography>
        </ContainerComponent>
    );
}