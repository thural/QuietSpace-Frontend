/**
 * InfinateScrollContainer Wrapper Component
 * 
 * Legacy wrapper for backward compatibility.
 * New implementations should use the decoupled version from ./InfinateScrollContainer/
 */

import InfinateScrollContainer as DecoupledInfinateScrollContainer from './InfinateScrollContainer';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { PureComponent, ReactNode } from 'react';

interface IInfinateScrollContainerProps extends GenericWrapper {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    children?: ReactNode;
}

/**
 * @deprecated Use InfinateScrollContainer from ./InfinateScrollContainer/ instead
 */
class InfinateScrollContainer extends PureComponent<IInfinateScrollContainerProps> {
    override render(): ReactNode {
        return <DecoupledInfinateScrollContainer {...this.props} />;
    }
}

export default InfinateScrollContainer;
