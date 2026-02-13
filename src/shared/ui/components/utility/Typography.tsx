import Text from '@/shared/ui/components/typography/Text';
import Title from '@/shared/ui/components/typography/Title';
import { GenericWrapper } from "@shared-types/sharedComponentTypes"
import React, { PureComponent, ReactNode } from 'react';

export type headingSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "small";

export interface ITypographyProps extends Omit<React.ComponentProps<typeof Text>, 'variant'>, Omit<GenericWrapper, 'children'> {
    type?: headingSize;
    children?: ReactNode;
}

class Typography extends PureComponent<ITypographyProps> {
    override render(): ReactNode {
        const { type, children, ...props } = this.props;

        switch (type) {
            case "h1": return <Title variant="h1" {...props}>{children}</Title>
            case "h2": return <Title variant="h2" {...props}>{children}</Title>
            case "h3": return <Title variant="h3" {...props}>{children}</Title>
            case "h4": return <Title variant="h4" {...props}>{children}</Title>
            case "h5": return <Title variant="h5" {...props}>{children}</Title>
            case "h6": return <Title variant="h6" {...props}>{children}</Title>
            case "small": return <Text variant="caption" {...props}>{children}</Text>
            default: return <Text {...props}>{children}</Text>
        }
    }
}

export default Typography