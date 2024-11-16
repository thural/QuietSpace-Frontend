import { Center } from "@mantine/core";

import { User } from "@/api/schemas/inferred/user";
import { ResId } from "@/api/schemas/native/common";
import styles from "@/components/profile/components/connections/base/styles/connectionStyles";
import UserQueryList from "@/components/profile/components/connections/list/UserQueryList";
import SearchBar from "@/components/profile/components/connections/searchbar/SearchBar";
import useSearch from "@/components/search/container/hooks/useSearch";
import BoxStyled from "@/components/shared/BoxStyled";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import CheckBox from "@/components/shared/CheckBox";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import InputStyled from "@/components/shared/InputStyled";
import Typography from "@/components/shared/Typography";
import UserQueryItem from "@/components/shared/UserQueryItem";
import { ConsumerFn } from "@/types/genericTypes";
import useBatchShareForm from "./hooks/useBatchShareForm";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import { nullishValidationdError } from "@/utils/errorUtils";

interface BatchShareFormProps {
    postId: ResId
    toggleForm: ConsumerFn
}

const BatchShareForm: React.FC<BatchShareFormProps> = ({ postId, toggleForm }) => {

    const classes = styles();
    let searchData = undefined;
    let formData = undefined;

    try {
        if (postId === undefined) throw nullishValidationdError({ postId });
        searchData = useSearch();
        formData = useBatchShareForm(postId, toggleForm);
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
        userQueryList,
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        fetchUserQuery
    } = searchData;

    const {
        isClientConnected,
        handleUserSelect,
        handleInputClick,
        handleMessageChange,
        handleSend
    } = formData;




    if (fetchUserQuery.isPending) return <FullLoadingOverlay />

    const SelectableUserItem = ({ data }: { data: User }) => (
        <UserQueryItem hasFollowToggle={false} data={data}>
            <CheckBox value={data.id} onChange={handleUserSelect} />
        </UserQueryItem>
    );

    return (
        <BoxStyled className={classes.container} >
            <Center><Typography type="h3">share</Typography></Center>
            <SearchBar
                placeHolder="search a user"
                handleInputBlur={handleInputBlur}
                handleInputChange={handleInputChange}
                handleInputFocus={handleInputFocus}
            />
            <UserQueryList
                Item={SelectableUserItem}
                userFetch={fetchUserQuery}
                queryResult={userQueryList}
            />
            <InputStyled
                variant="unstyled"
                style={{ width: "100%", margin: "1rem 0" }}
                placeholder="write a message"
                onClick={handleInputClick}
                onChange={handleMessageChange}
            />
            <DarkButton loading={!isClientConnected} style={{ width: "100%" }} name="send" handleClick={handleSend} />
        </BoxStyled>
    )
}

export default withErrorBoundary(BatchShareForm);