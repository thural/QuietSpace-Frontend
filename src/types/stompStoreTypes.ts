export type ClientContextType = Record<string, any>;

export interface StompStore {
    clientContext: ClientContextType;
    setClientContext: (methods: ClientContextType) => void;
}