
import { Link } from "react-router-dom";

export interface CustomLinkProps { to: string, text: string, Component: React.ReactNode }

const CustomLink: React.FC<CustomLinkProps> = ({ to, Component }) => (
    <Link to={to} >
        {Component}
    </Link>
)

export default CustomLink