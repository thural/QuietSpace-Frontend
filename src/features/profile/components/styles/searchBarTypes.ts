import { GenericWrapper } from "@shared-types/sharedComponentTypes"
import { ChangeEventHandler, FocusEventHandler } from "react"

export interface SearchBarProps extends GenericWrapper {
    handleInputBlur: FocusEventHandler<HTMLInputElement>
    handleInputChange: ChangeEventHandler<HTMLInputElement>
    handleInputFocus: FocusEventHandler<HTMLInputElement>
    placeHolder?: string
}