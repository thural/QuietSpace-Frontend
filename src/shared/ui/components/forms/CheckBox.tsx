import { ResId } from "@/shared/api/models/commonNative";
import { Container } from '@/shared/ui/components/layout/Container';
import { ChangeEvent, MouseEvent, PureComponent, ReactNode } from 'react';
import CheckboxComponent from './CheckboxComponent';
import { ThemeTokenMixin } from '../../utils/themeTokenHelpers';

interface ICheckBoxProps {
    value: ResId;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    error?: boolean;
}

class CheckBox extends PureComponent<ICheckBoxProps> {
    static defaultProps: Partial<ICheckBoxProps> = {
        size: 'md',
        disabled: false,
        error: false
    };

    // Size mapping using theme tokens
    private readonly sizeMap: Record<string, string> = {
        xs: '16px',
        sm: '20px',
        md: '24px',
        lg: '28px',
        xl: '32px'
    };

    // Get checkbox size with fallback
    private getCheckboxSize = (): string => {
        const { size } = this.props;
        return this.sizeMap[size!] || this.sizeMap.md;
    };

    override render(): ReactNode {
        const { value, onChange, disabled } = this.props;

        return (
            <Container>
                <CheckboxComponent
                    checked={false}
                    disabled={disabled}
                    onChange={(checked) => {
                        const event = {
                            target: { value: checked ? value : '', checked }
                        } as ChangeEvent<HTMLInputElement>;
                        onChange(event);
                    }}
                />
            </Container>
        );
    }
}

export default CheckBox;