/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { getSpacing, getColor } from '../../../utils';
import { TextAreaStyledProps } from './interfaces';
import { createTextAreaContainerStyles } from './styles';

/**
 * TextAreaStyled Component
 * 
 * An enterprise text area component with theme integration and error handling.
 * Provides responsive design and accessibility features.
 */
class TextAreaStyled extends PureComponent<TextAreaStyledProps> {
  static defaultProps: Partial<TextAreaStyledProps> = {
    name: "",
    value: "",
    placeholder: "",
    maxLength: 999,
    minLength: 0,
    hidden: false,
    disabled: false,
    error: false,
    rows: 4
  };

  private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { handleChange } = this.props;
    handleChange(event.target.value);
  };

  private renderHelperText = (theme: any): ReactNode => {
    const { error } = this.props;

    if (!error) return null;

    return (
      <div css={css`
        font-size: ${getSpacing(theme, 12)};
        margin-top: ${getSpacing(theme, 4)};
        color: ${getColor(theme, 'semantic.error')};
      `}>
        This field has an error
      </div>
    );
  };

  override render(): ReactNode {
    const {
      name,
      value,
      placeholder,
      maxLength,
      minLength,
      hidden,
      disabled,
      error,
      rows,
      className,
      theme,
      ...props
    } = this.props;

    return (
      <div css={createTextAreaContainerStyles(theme || {} as any, error)} className={className}>
        <textarea
          className="textarea-field"
          name={name}
          value={value}
          onChange={this.handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          hidden={hidden}
          disabled={disabled}
          css={css`
            border-color: ${error ? getColor(theme || {} as any, 'semantic.error') : undefined};
            box-shadow: ${error ? `0 0 0 3px ${getColor(theme || {} as any, 'semantic.error')}20` : undefined};
          `}
          rows={rows}
          {...props}
        />
        {this.renderHelperText(theme || {} as any)}
      </div>
    );
  }
}

export default TextAreaStyled;
