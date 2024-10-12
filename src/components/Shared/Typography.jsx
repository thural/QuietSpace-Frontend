import { Text, Title } from "@mantine/core"

const Typography = ({ type, children, ...props }) => {
    switch (type) {
        case "h1": return <Title order={1} {...props}>{children}</Title>
        case "h2": return <Title order={2} {...props}>{children}</Title>
        case "h3": return <Title order={3} {...props}>{children}</Title>
        case "h4": return <Title order={4} {...props}>{children}</Title>
        case "h5": return <Title order={5} {...props}>{children}</Title>
        case "h6": return <Title order={6} {...props}>{children}</Title>
        default: return <Text {...props}>{children}</Text>
    }
}

export default Typography