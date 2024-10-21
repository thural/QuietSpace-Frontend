import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import { CSSProperties, KeyboardEventHandler, FocusEventHandler, ChangeEventHandler, RefObject } from 'react'

export interface SearchBarProps extends GenericWrapper {
    style?: CSSProperties;
    handleKeyDown: KeyboardEventHandler<HTMLInputElement>;
    handleInputBlur: FocusEventHandler<HTMLInputElement>;
    handleInputFocus: FocusEventHandler<HTMLInputElement>;
    handleInputChange: ChangeEventHandler<HTMLInputElement>;
    queryInputRef: RefObject<HTMLInputElement>;
}