const ComponentList = ({ Component, list, ...props }) => (
    list.map((elem, index) =>
        <Component key={index} data={elem} {...props} />)
);

export default ComponentList