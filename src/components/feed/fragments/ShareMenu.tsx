import Clickable from "@/components/shared/Clickable";
import ListMenu, { MenuListStyleProps } from "@/components/shared/ListMenu";
import { ConsumerFn } from "@/types/genericTypes";
import { useState } from "react";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";

interface ShareMenuProps {
    handleShareClick: ConsumerFn
    handleRepostClick: ConsumerFn
}

const styleProps: MenuListStyleProps = { position: 'relative', fontSize: "1.5rem", fontWeight: '300', display: "block" }

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
            <Clickable text="Send" handleClick={handleLocalShareClick} styleProps={styleProps} >
                <PiPaperPlaneTilt />
            </Clickable>
            <Clickable text="Repost" handleClick={handleLocalRepostClick} styleProps={styleProps}>
                <PiArrowsClockwise />
            </Clickable>
        </ListMenu>
    )
};

export default ShareMenu