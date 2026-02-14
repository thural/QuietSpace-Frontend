import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode, RefObject, createRef } from 'react';
import { IHiddenFileInputProps, IHiddenFileInputState } from './interfaces';
import { HiddenFileInputWrapper, HiddenInput } from './styles';

/**
 * Extended props interface for HiddenFileInput component
 */
interface IHiddenFileInputExtendedProps extends IHiddenFileInputProps, IBaseComponentProps {
  /** Additional className for styling */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Extended state interface for HiddenFileInput component
 */
interface IHiddenFileInputExtendedState extends IHiddenFileInputState, IBaseComponentState {
  /** Additional state properties if needed */
}

/**
 * Enterprise HiddenFileInput Component
 * 
 * A file input component that hides the actual input element and uses a custom component
 * as the trigger. Follows enterprise architecture patterns with proper decoupling.
 */
export class HiddenFileInput extends BaseClassComponent<IHiddenFileInputExtendedProps, IHiddenFileInputExtendedState> {
  private fileInputRef: RefObject<HTMLInputElement | null>;

  constructor(props: IHiddenFileInputExtendedProps) {
    super(props);
    this.fileInputRef = createRef<HTMLInputElement>();
  }

  protected override getInitialState(): Partial<IHiddenFileInputExtendedState> {
    return {};
  }

  private handleClick = (): void => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  protected override renderContent(): ReactNode {
    const {
      onFileChange,
      Component,
      className,
      testId = 'hidden-file-input'
    } = this.props;

    return (
      <div css={HiddenFileInputWrapper} className={className} data-testid={testId}>
        <Component onClick={this.handleClick} />
        <input
          css={HiddenInput}
          type="file"
          ref={this.fileInputRef}
          onChange={onFileChange}
        />
      </div>
    );
  }
}

export default HiddenFileInput;
