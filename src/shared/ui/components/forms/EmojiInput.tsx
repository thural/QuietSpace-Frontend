import { EnhancedTheme } from '@/core/theme';
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';
import InputEmoji from "react-input-emoji";
import styled from 'styled-components';

// Enterprise styled-components using theme system
const EmojiInputWrapper = styled.div<{ theme: EnhancedTheme }>`
  position: relative;
  
  .react-input-emoji--container {
    background: ${props => props.theme.colors.background.primary};
    border: 1px solid ${props => props.theme.colors.border.medium};
    border-radius: ${props => props.theme.radius.md};
    transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
    
    &:focus-within {
      border-color: ${props => props.theme.colors.brand[500]};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.brand[200]};
    }
  }
  
  .react-emoji-picker--wrapper {
    position: absolute;
    top: 3rem;
    right: 0;
    height: 435px;
    width: 352px;
    overflow: hidden;
    z-index: 10;
    background: ${props => props.theme.colors.background.primary};
    border: 1px solid ${props => props.theme.colors.border.medium};
    border-radius: ${props => props.theme.radius.lg};
    box-shadow: ${props => props.theme.shadows.xl};
  }
  
  .react-input-emoji--button {
    color: ${props => props.theme.colors.text.secondary};
    right: 0;
    width: fit-content;
    display: flex;
    padding: ${props => props.theme.spacing.md};
    position: absolute;
    font-size: 1rem;
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    z-index: 1;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: ${props => props.theme.radius.md};
    transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
    
    &:hover {
      background: ${props => props.theme.colors.background.tertiary};
      color: ${props => props.theme.colors.text.primary};
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  .react-input-emoji--input {
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.typography.fontSize.base};
    font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
    color: ${props => props.theme.colors.text.primary};
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    
    &::placeholder {
      color: ${props => props.theme.colors.text.tertiary};
    }
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    .react-emoji-picker--wrapper {
      width: 280px;
      height: 350px;
    }
  }
`;

interface IEmojiInputProps extends GenericWrapperWithRef {
    isEnabled?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    maxLength?: number;
    fontSize?: number;
    onEnter?: () => void;
    variant?: 'default' | 'outlined' | 'filled';
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
    disabled?: boolean;
}

class EmojiInput extends PureComponent<IEmojiInputProps> {
    static defaultProps: Partial<IEmojiInputProps> = {
        isEnabled: true,
        maxLength: 255,
        fontSize: 15,
        variant: 'default',
        size: 'md',
        placeholder: 'Type a message...'
    };

    private getThemeStyles = (): React.CSSProperties => {
        const { variant, size } = this.props;

        const sizeStyles = {
            sm: { fontSize: '14px', padding: '8px 12px' },
            md: { fontSize: '15px', padding: '12px 16px' },
            lg: { fontSize: '16px', padding: '16px 20px' }
        };

        return {
            ...sizeStyles[size as keyof typeof sizeStyles]
        };
    };

    render(): ReactNode {
        const {
            forwardedRef,
            value,
            onChange,
            fontSize,
            maxLength,
            onEnter,
            variant,
            size,
            placeholder,
            disabled,
            ...props
        } = this.props;

        return (
            <EmojiInputWrapper>
                <InputEmoji
                    ref={forwardedRef}
                    value={value}
                    onChange={onChange}
                    fontSize={fontSize}
                    maxLength={maxLength}
                    cleanOnEnter
                    background="transparent"
                    onEnter={onEnter}
                    theme="auto"
                    shouldReturn={true}
                    shouldConvertEmojiToImage={false}
                    placeholder={placeholder}
                    {...props}
                />
            </EmojiInputWrapper>
        );
    }
}

export default withForwardedRefAndErrBoundary(EmojiInput);