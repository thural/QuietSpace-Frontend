import useUserQueries from "@/api/queries/userQueries";
import { useUploadProfilePhoto } from "@/services/data/useUserData";
import useStyles from "@/styles/settings/profileModifierStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { ChangeEvent, useState } from "react";
import BaseCard from "../shared/BaseCard";
import BoxStyled from "../shared/BoxStyled";
import LightButton from "../shared/buttons/LightButton";
import Clickable from "../shared/Clickable";
import HiddenFileInput from "../shared/HiddenFileInput";
import LoaderStyled from "../shared/LoaderStyled";
import ModalStyled from "../shared/ModalStyled";
import Overlay from "../shared/Overlay";
import Typography from "../shared/Typography";
import UserCard from "../shared/UserCard";

/**
 * ProfilePhotoModifier component.
 * 
 * This component allows users to change their profile photo. It provides functionality to upload a new photo,
 * remove the current photo, and cancel the upload action. The component handles the display of a modal for
 * photo upload and integrates with user queries and upload services.
 * 
 * @returns {JSX.Element} - The rendered ProfilePhotoModifier component.
 */
const ProfilePhotoModifier = () => {
    const classes = useStyles(); // Get styles for the component
    const { getSignedUserElseThrow } = useUserQueries(); // Hook to get signed user information
    const signedUser = getSignedUserElseThrow(); // Retrieve the signed user or throw an error if not available
    const [modalDisplay, setModalDisplay] = useState<boolean>(false); // State to control modal visibility

    /**
     * Toggles the modal display state.
     * 
     * @param {React.MouseEvent} event - The mouse event triggered by the click.
     */
    const handleModalToggle = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent event from bubbling up
        setModalDisplay(!modalDisplay); // Toggle modal visibility
    };

    const uploadPhoto = useUploadProfilePhoto(handleModalToggle); // Hook to handle photo upload

    /**
     * Handles the file input change event.
     * 
     * @param {ChangeEvent<HTMLInputElement>} e - The change event triggered by file input.
     */
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return; // Check if files are selected
        const formData = new FormData(); // Create FormData object
        formData.append('image', e.target.files[0]); // Append the selected file
        uploadPhoto.mutate(formData); // Trigger the upload
    };

    /**
     * UploadClick component.
     * 
     * This component renders a clickable area for uploading a photo.
     * 
     * @param {GenericWrapper} props - The component props.
     * @returns {JSX.Element} - The rendered UploadClick component.
     */
    const UploadClick: React.FC<GenericWrapper> = ({ onClick }) => (
        <Clickable className={classes.listItem} onClick={onClick}>
            <Typography ta="center" type="h4">upload photo</Typography>
        </Clickable>
    );

    return (
        <BaseCard>
            <UserCard isDisplayEmail={true} userId={signedUser.id} /> {/* Display user information */}
            <LightButton
                variant="filled"
                color="blue"
                style={{ width: "13rem" }}
                name="change photo"
                handleClick={handleModalToggle} // Open the modal to change photo
            />
            <Overlay isOpen={modalDisplay} onClose={handleModalToggle}> {/* Modal overlay */}
                <ModalStyled style={{ alignItems: "center", cursor: "pointer", maxWidth: "30%" }}>
                    <Typography type="h3">Change Profile Photo</Typography>
                    <BoxStyled>
                        <HiddenFileInput onFileChange={handleFileChange} Component={UploadClick} /> {/* Hidden file input for photo upload */}
                        <Clickable className={classes.listItem}>
                            <Typography ta="center" type="h4">remove profile photo</Typography> {/* Option to remove the photo */}
                        </Clickable>
                        <Clickable className={classes.listItem} onClick={handleModalToggle}>
                            <Typography ta="center" type="h4">cancel</Typography> {/* Option to cancel the action */}
                        </Clickable>
                    </BoxStyled>
                    {uploadPhoto.isPending && <LoaderStyled />} {/* Show loader if upload is in progress */}
                </ModalStyled>
                <Clickable handleClick={null} text="remove photo" /> {/* Placeholder for remove photo action */}
            </Overlay>
        </BaseCard>
    );
};

export default ProfilePhotoModifier;