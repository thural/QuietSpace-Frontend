import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";

export interface NavItemProps extends GenericWrapper {
    linkTo: string,
    pathName: string,
    icon: React.ReactNode,
    iconFill: React.ReactNode,
}