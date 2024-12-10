import { UserResponse } from "@/api/schemas/inferred/user";
import { ResId } from "@/api/schemas/native/common";
import UserQueryList from "@/components/profile/connections/UserQueryList";
import SearchBar from "@/components/profile/searchbar/SearchBar";
import BoxStyled from "@/components/shared/BoxStyled";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import CheckBox from "@/components/shared/CheckBox";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import InputStyled from "@/components/shared/InputStyled";
import LoaderStyled from "@/components/shared/LoaderStyled";
import Typography from "@/components/shared/Typography";
import UserQueryItem from "@/components/shared/UserQueryItem";
import useBatchShareForm from "@/services/hook/chat/useBatchShareForm";
import useSearch from "@/services/hook/search/useSearch";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/profile/connectionStyles";
import { ConsumerFn } from "@/types/genericTypes";
import { assertIsNotNullish } from "@/utils/assertions";
import { Center } from "@mantine/core";

interface BatchShareFormProps {
    postId: ResId
    toggleForm: ConsumerFn
}

const BatchShareForm: React.FC<BatchShareFormProps> = ({ postId, toggleForm }) => {

    const classes = styles();
    let searchData = undefined;
    let formData = undefined;

    try {
        assertIsNotNullish({ postId });
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
        handleMessageChange,
        handleSend
    } = formData;



    if (fetchUserQuery.isPending) return <LoaderStyled />

    const SelectableUserItem: React.FC<{ data: UserResponse }> = ({ data }) => (
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