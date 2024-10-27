
import { Link } from "react-router-dom";
import Clickable from "@shared/Clickable";

export interface CustomLinkProps { to: string, text: string, Component: React.ReactNode }

const CustomLink: React.FC<CustomLinkProps> = ({ to, text, Component }) => (
    <Link to={to} >
        <Clickable text={text} >
            {Component}
        </Clickable>
    </Link>
)

export default CustomLink