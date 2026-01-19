import Clickable from "@/shared/Clickable";
import ListMenu, { MenuListStyleProps } from "@/shared/ListMenu";
import { ConsumerFn } from "@/types/genericTypes";
import { useState } from "react";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";

/**
 * Props for the ShareMenu component.
 * 
 * @interface ShareMenuProps
 * @property {ConsumerFn} handleShareClick - Function to handle the share action.
 * @property {ConsumerFn} handleRepostClick - Function to handle the repost action.
 */
interface ShareMenuProps {
    handleShareClick: ConsumerFn;
    handleRepostClick: ConsumerFn;
}

/**
 * Style properties for the menu list.
 * 
 * @constant styleProps
 * @type {MenuListStyleProps}
 */
const styleProps: MenuListStyleProps = { position: 'relative', fontSize: "1.5rem", fontWeight: '300', display: "block" };

/**
 * ShareMenu component.
 * 
 * This component provides a menu for sharing and reposting content. It contains options
 * for sending and reposting, and it manages the visibility of its options based on user interactions.
 * 
 * @param {ShareMenuProps} props - The component props.
 * @returns {JSX.Element} - The rendered ShareMenu component.
 */
const ShareMenu: React.FC<ShareMenuProps> = ({ handleShareClick, handleRepostClick }) => {
    const [display, setDisplay] = useState(styleProps.display);

    const handleLocalShareClick = (e: MouseEvent) => {
        handleShareClick();
        setDisplay("none");
    }

    const handleLocalRepostClick = (e: MouseEvent) => {
        handleRepostClick();
        setDisplay("none");
    }

    return (
        <ListMenu menuIcon={<PiShareFat />} styleProps={{ ...styleProps, display }}>
            <Clickable text="Send" handleClick={handleLocalShareClick} styleProps={styleProps}>
                <PiPaperPlaneTilt />
            </Clickable>
            <Clickable text="Repost" handleClick={handleLocalRepostClick} styleProps={styleProps}>
                <PiArrowsClockwise />
            </Clickable>
        </ListMenu>
    );
};

export default ShareMenu;