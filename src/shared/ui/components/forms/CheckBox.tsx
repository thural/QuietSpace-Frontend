import { ResId } from "@/shared/api/models/commonNative";
import { Container } from '@/shared/ui/components/layout/Container';
import { ChangeEvent, MouseEvent, PureComponent, ReactNode } from 'react';
import CheckboxComponent from './CheckboxComponent';

interface ICheckBoxProps {
    value: ResId;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

class CheckBox extends PureComponent<ICheckBoxProps> {
    // Handle checkbox click to prevent event bubbling
    private handleSelectClick = (event: MouseEvent<HTMLInputElement>): void => {
        event.stopPropagation();
        event.preventDefault();
    };

    // Handle checkbox change event
    private handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { onChange } = this.props;
        onChange(event);
    };

    render(): ReactNode {
        const { value, onChange } = this.props;

        return (
            <CheckboxComponent
                checked={false}
                onChange={(checked) => {
                    const event = {
                        target: { value: checked ? value : '', checked }
                    } as ChangeEvent<HTMLInputElement>;
                    onChange(event);
                }}
            />
        );
    }
}

export default CheckBox;