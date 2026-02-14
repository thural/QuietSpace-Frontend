import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';
import { IInputBoxStyledProps, IInputBoxStyledState } from './interfaces';
import { InputBoxWrapper } from './styles';

/**
 * Extended props interface for InputBoxStyled component
 */
interface IInputBoxStyledExtendedProps extends IInputBoxStyledProps, IBaseComponentProps {
  /** Additional className for styling */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Extended state interface for InputBoxStyled component
 */
interface IInputBoxStyledExtendedState extends IInputBoxStyledState, IBaseComponentState {
  /** Additional state properties if needed */
}

/**
 * Enterprise InputBoxStyled Component
 * 
 * A flexible container component for form inputs that follows enterprise architecture patterns.
 * Features proper decoupling, BaseClassComponent inheritance, and Emotion CSS styling.
 */
export class InputBoxStyled extends BaseClassComponent<IInputBoxStyledExtendedProps, IInputBoxStyledExtendedState> {
  protected override getInitialState(): Partial<IInputBoxStyledExtendedState> {
    return {};
  }

  protected override renderContent(): ReactNode {
    const {
      children,
      theme,
      className,
      testId = 'input-box-styled'
    } = this.props;

    return (
      <div
        css={InputBoxWrapper(theme || {} as any)}
        className={className}
        data-testid={testId}
      >
        {children}
      </div>
    );
  }
}

export default InputBoxStyled;
