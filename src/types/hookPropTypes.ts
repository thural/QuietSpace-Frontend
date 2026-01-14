import { ChatResponse } from "@/api/schemas/inferred/chat";
import { AnyFunction, ErrorFunction } from "./genericTypes";


export interface JwtAuthProps {
    refreshInterval?: number;
    onSuccessFn: AnyFunction;
    onErrorFn?: ErrorFunction;
    onLoadFn?: AnyFunction;
}

export interface QueryProps {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void
}