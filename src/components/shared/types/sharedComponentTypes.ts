import React, { ReactNode } from "react"

export interface GenericWrapperWithRef {
  children?: ReactNode
  forwardedRef: React.Ref<any>
  [key: string]: any
}

export interface GenericWrapper {
  children?: ReactNode
  [key: string]: any
}