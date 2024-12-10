import { ChatResponse } from "@/api/schemas/inferred/chat";
import { AnyFunction, ErrorFunction } from "./genericTypes";


export interface JwtAuthProps {
    refreshInterval?: number;
    onSuccessFn: AnyFunction;
    onErrorFn?: ErrorFunction;
    onLoadFn?: AnyFunction;
}

export interface QueryProps {
    onSuccess?: (data: ChatResponse) => void;
    onError?: (error: Error) => void
}