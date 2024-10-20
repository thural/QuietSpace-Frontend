import { AnyFunction, ErrorFunction } from "./genericTypes";


export interface JwtAuthProps {
    refreshInterval: number;
    onSuccessFn: AnyFunction;
    onErrorFn: ErrorFunction;
    onLoadFn: AnyFunction;
}