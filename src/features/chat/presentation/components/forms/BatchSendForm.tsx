import { UserResponse } from "@/features/profile/data/models/user";
import { ResId } from "@/shared/api/models/commonNative";
import UserQueryList from "@/features/profile/components/connections/UserQueryList";
import SearchBar from "@/features/profile/components/searchbar/SearchBar";
import { Container } from "@features/profile/components/connections/styles/ConnectionStyles";
import { Button } from "../../../../shared/ui/components";
import CheckBox from "@/shared/CheckBox";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import { Input } from "../../../../shared/ui/components";
import LoaderStyled from "@/shared/LoaderStyled";
import { Text } from "../../../../shared/ui/components";
import UserQueryItem from "@/shared/UserQueryItem";
import useBatchShareForm from "@features/chat/application/hooks/useBatchShareForm";
import useSearch from "@/features/search/application/hooks/useSearch";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { assertIsNotNullish } from "@/shared/utils/assertions";
import { CenterContainer } from "@/shared/ui/components/layout/CenterContainer";
import React from 'react';

/**
 * Props for the BatchShareForm component.
 *
 * @interface BatchShareFormProps
 * @property {ResId} postId - The ID of the post to share.
 * @property {ConsumerFn} toggleForm - Function to toggle the visibility of the form.
 */
interface BatchShareFormProps {
    postId: ResId;
    toggleForm: ConsumerFn;
}

/**
 * BatchShareForm component for sharing a post with multiple users.
 *
 * @param {BatchShareFormProps} props - The props for the BatchShareForm component.
 * @returns {JSX.Element} - The rendered batch share form component.
 */
const BatchShareForm: React.FC<BatchShareFormProps> = ({ postId, toggleForm }) => {
    try {
        assertIsNotNullish({ postId });
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const searchData = useSearch();
    const formData = useBatchShareForm(postId, toggleForm);

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

    /** Renders a selectable user item with checkbox */
    const SelectableUserItem = ({ data }: { data: UserResponse }) => (
        <UserQueryItem
            hasFollowToggle={false}
            data={data}
            handleItemClick={(e) => e.stopPropagation()}
            children={<CheckBox value={data.id} onChange={handleUserSelect} />}
        />
    );

    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    if (fetchUserQuery.isPending) return <LoaderStyled />;

    return (
        <Container onClick={handleContainerClick}>
            <CenterContainer>
                <Text variant="h3">share</Text>
            </CenterContainer>
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
            <Input
                variant="unstyled"
                style={{ width: "100%", margin: "1rem 0" }}
                placeholder="write a message"
                onChange={handleMessageChange}
            />
            <Button
                loading={!isClientConnected}
                style={{ width: "100%" }}
                variant="primary"
                onClick={handleSend}
            >
                send
            </Button>
        </Container>
    );
};

export default withErrorBoundary(BatchShareForm);