import { formatFileSize } from "@/shared/utils/stringUtils";
import { Container } from '@/shared/ui/components/layout/Container';
import OutlineButton from "../../buttons/OutlineButton";
import { EnterpriseInput } from "@/shared/ui/components";
import Typography from "../utility/Typography";
import React, { PureComponent, ReactNode } from 'react';

interface IFileUploaderProps {
    fetchCallback?: (file: File) => Promise<any>;
}

interface IFileUploaderState {
    file: File | null;
    status: 'idle' | 'uploading' | 'success' | 'error';
}

class FileUploader extends PureComponent<IFileUploaderProps, IFileUploaderState> {
    constructor(props: IFileUploaderProps) {
        super(props);
        this.state = {
            file: null,
            status: 'idle'
        };
    }

    // Handle file change
    private handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        if (files && files.length > 0) {
            this.setState({ file: files[0] || null });
        }
    };

    // Handle file upload
    private handleFileUpload = (): void => {
        const { file } = this.state;
        const { fetchCallback } = this.props;

        if (!file || !fetchCallback) return;

        this.setState({ status: 'uploading' });

        fetchCallback(file)
            .then(() => {
                this.setState({ status: 'success' });
            })
            .catch(() => {
                this.setState({ status: 'error' });
            });
    };

    override render(): ReactNode {
        const { file, status } = this.state;

        return (
            <Container>
                <EnterpriseInput type="file" onChange={this.handleFileChange} useTheme={false} />
                <OutlineButton
                    name="upload"
                    disabled={!file}
                    loading={status === "uploading"}
                    onClick={this.handleFileUpload}
                />
                {file && (
                    <>
                        <Typography>file name: {file.name}</Typography>
                        <Typography>file size: {formatFileSize(file.size)}</Typography>
                        <Typography>file type: {file.type}</Typography>
                    </>
                )}
            </Container>
        );
    }
}

export default FileUploader;