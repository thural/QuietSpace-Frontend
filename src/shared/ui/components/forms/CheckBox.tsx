import { ResId } from "@/shared/api/models/commonNative";
import { Container } from '@/shared/ui/components/layout/Container';
import { ChangeEvent, PureComponent, ReactNode } from 'react';
import CheckboxComponent from './CheckboxComponent';

interface ICheckBoxProps {
    value: ResId;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    error?: boolean;
    theme?: any;
}

class CheckBox extends PureComponent<ICheckBoxProps> {
    static defaultProps: Partial<ICheckBoxProps> = {
        size: 'md',
        disabled: false,
        error: false
    };

    override render(): ReactNode {
        const { value, onChange, disabled, theme } = this.props;

        return (
            <Container theme={theme}>
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