/** @jsxImportSource @emotion/react */
import { ChangeEvent, PureComponent, ReactNode, createRef } from 'react';
import { IFileInputProps } from './interfaces';
import { createFileInputContainerStyles, createFileInputButtonStyles, createFileInputHiddenStyles } from './styles';

/**
 * FileInput Component
 * 
 * A file input component with drag-and-drop appearance.
 * Provides accessible file handling with theme integration.
 */
class FileInput extends PureComponent<IFileInputProps> {
    private fileInputRef = createRef<HTMLInputElement>();

    /**
     * Handle file selection
     */
    private handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
        const { onChange, multiple } = this.props;
        
        if (onChange) {
            const files = event.target.files;
            if (multiple) {
                onChange(files);
            } else {
                onChange(files && files[0]);
            }
        }
    };

    /**
     * Handle button click to trigger file input
     */
    private handleButtonClick = (): void => {
        this.fileInputRef.current?.click();
    };

    override render(): ReactNode {
        const {
            value,
            onChange,
            placeholder = 'Choose file',
            accept,
            disabled = false,
            multiple = false,
            size = 'md',
            theme,
            className,
            testId
        } = this.props;

        const containerStyles = createFileInputContainerStyles(theme);
        const buttonStyles = createFileInputButtonStyles(theme, size, disabled);
        const hiddenStyles = createFileInputHiddenStyles;

        return (
            <div css={containerStyles} className={className} data-testid={testId}>
                <input
                    ref={this.fileInputRef}
                    type="file"
                    css={hiddenStyles}
                    onChange={this.handleFileSelect}
                    accept={accept}
                    disabled={disabled}
                    multiple={multiple}
                />
                <button
                    type="button"
                    css={buttonStyles}
                    onClick={this.handleButtonClick}
                    disabled={disabled}
                >
                    {value ? value.name : placeholder}
                </button>
            </div>
        );
    }
}

export default FileInput;
