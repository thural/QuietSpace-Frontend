/** @jsxImportSource @emotion/react */
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { PureComponent, ReactNode } from 'react';
import Input from "../interactive/Input";
import { css } from '@emotion/react';
import { getSpacing, getColor, getTypography } from '../../../utils';
import { IInputStyledProps } from './interfaces';
import { createInputStyledContainerStyles } from './styles';

/**
 * InputStyled Component
 * 
 * An enhanced input component with multiple variants, sizes, and states.
 * Provides enterprise styling with theme integration and accessibility.
 */
class InputStyled extends PureComponent<IInputStyledProps> {
  static defaultProps: Partial<IInputStyledProps> = {
    isStyled: false,
    variant: 'default',
    size: 'md',
    disabled: false,
    error: false
  };

  private handleFocus = (event: React.FocusEvent): void => {
    const { onFocus } = this.props;
    onFocus?.(event);
  };

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { onChange } = this.props;
    onChange?.(event);
  };

  private handleBlur = (event: React.FocusEvent): void => {
    const { onBlur } = this.props;
    onBlur?.(event);
  };

  private renderHelperText = (): ReactNode => {
    const { error, helperText, theme } = this.props;

    if (!helperText) return null;

    return (
      <div
        css={css`
          font-size: ${getTypography(theme || {} as any, 'fontSize.xs')};
          margin-top: ${getSpacing(theme || {} as any, 'xs')};
          color: ${error ? getColor(theme || {} as any, 'semantic.error') : getColor(theme || {} as any, 'text.tertiary')};
        `}
      >
        {helperText}
      </div>
    );
  };

  override render(): ReactNode {
    const {
      isStyled,
      forwardedRef,
      placeholder,
      variant,
      size,
      disabled,
      error,
      theme,
      ...props
    } = this.props;

    if (isStyled) {
      return (
        <div
          css={createInputStyledContainerStyles(theme, variant, size, error)}
        >
          <input
            ref={forwardedRef}
            className="input-field"
            placeholder={placeholder}
            disabled={disabled}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            {...props}
          />
          {this.renderHelperText()}
        </div>
      );
    }

    const inputProps: any = {
      placeholder: placeholder || '',
      onFocus: this.handleFocus,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      ...props
    };

    if (forwardedRef) {
      inputProps.ref = forwardedRef;
    }

    return <Input {...inputProps} />;
  }
}

export default withForwardedRefAndErrBoundary(InputStyled);
