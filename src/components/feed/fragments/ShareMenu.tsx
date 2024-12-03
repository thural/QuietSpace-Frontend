import Clickable from "@/components/shared/Clickable";
import ListMenu, { MenuListStyleProps } from "@/components/shared/ListMenu";
import { ConsumerFn } from "@/types/genericTypes";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";

interface ShareMenuProps {
    handleShareClick: ConsumerFn
    handleRepostClick: ConsumerFn
}

const styleProps: MenuListStyleProps = { position: 'relative', fontSize: "1.5rem", fontWeight: '300' }

const ShareMenu: React.FC<ShareMenuProps> = ({ handleShareClick, handleRepostClick }) => (
    <ListMenu menuIcon={<PiShareFat />} styleProps={styleProps}>
        <Clickable text="Send" handleClick={handleShareClick} styleProps={styleProps}>
            <PiPaperPlaneTilt />
        </Clickable>
        <Clickable text="Repost" handleClick={handleRepostClick} styleProps={styleProps}>
            <PiArrowsClockwise />
        </Clickable>
    </ListMenu>
);

export default ShareMenu