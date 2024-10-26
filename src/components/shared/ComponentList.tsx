import { GenericWrapper } from "./types/sharedComponentTypes";

const ComponentList: React.FC<GenericWrapper> = ({ Component, list, ...props }) => (
    list.map((elem: any, index: any) =>
        <Component key={index} data={elem} {...props} />)
);

export default ComponentList