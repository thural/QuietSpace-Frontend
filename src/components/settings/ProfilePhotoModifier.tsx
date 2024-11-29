import { ChangeEvent, useState } from "react"
import BaseCard from "../shared/BaseCard"
import LightButton from "../shared/buttons/LightButton"
import ModalStyled from "../shared/ModalStyled"
import Overlay from "../shared/Overlay"
import UserCard from "../shared/UserCard"
import HiddenFileInput from "../shared/HiddenFileInput"
import Clickable from "../shared/Clickable"
import { getSignedUserElseThrow } from "@/api/queries/userQueries"
import { useUploadProfilePhoto } from "@/services/data/useUserData"
import LoaderStyled from "../shared/LoaderStyled"
import Typography from "../shared/Typography"
import BoxStyled from "../shared/BoxStyled"
import { GenericWrapper } from "@/types/sharedComponentTypes"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
    listItem: {
        padding: '10px 20px',
        '&:not(:last-child)': { borderBottom: '1px solid #ccc', },
    },
});

const ProfilePhotoModifier = () => {

    const classes = useStyles();

    const signedUser = getSignedUserElseThrow();
    const [modalDisplay, setModalDisplay] = useState<boolean>(false);


    const handleModalToggle = (event: React.MouseEvent) => {
        event.stopPropagation();
        setModalDisplay(!modalDisplay);
    };

    const uploadPhoto = useUploadProfilePhoto(handleModalToggle);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        uploadPhoto.mutate(formData);
    }

    const UploadClick: React.FC<GenericWrapper> = ({ onClick }) => (
        <Clickable className={classes.listItem} onClick={onClick}>
            <Typography ta="center" type="h4">upload photo</Typography>
        </Clickable>
    );


    return (
        <BaseCard>
            <UserCard isDisplayEmail={true} userId={signedUser.id} />
            <LightButton variant="filled" color="blue" style={{ width: "13rem" }} name="change photo" handleClick={handleModalToggle} />
            <Overlay isOpen={modalDisplay} onClose={handleModalToggle}>
                <ModalStyled style={{ alignItems: "center", cursor: "pointer", maxWidth: "30%" }}>
                    <Typography type="h3">Change Profile Photo</Typography>
                    <BoxStyled>
                        <HiddenFileInput onFileChange={handleFileChange} Component={UploadClick} />
                        <Clickable className={classes.listItem}>
                            <Typography ta="center" type="h4">remove profile photo</Typography>
                        </Clickable>
                        <Clickable className={classes.listItem} onClick={handleModalToggle}>
                            <Typography ta="center" type="h4">cancel</Typography>
                        </Clickable>
                    </BoxStyled>
                    {uploadPhoto.isPending && <LoaderStyled />}
                </ModalStyled>
                <Clickable handleClick={null} text="remove photo" />
            </Overlay>
        </BaseCard>
    )
}

export default ProfilePhotoModifier