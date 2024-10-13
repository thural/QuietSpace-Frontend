import React from "react";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "../Shared/BoxStyled";
import Conditional from "../Shared/Conditional";
import DefaultContainer from "../Shared/DefaultContainer";
import FlexStyled from "../Shared/FlexStyled";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import InputStyled from "../Shared/InputStyled";
import UserAvatar from "../Shared/UserAvatar";
import LightButton from "../Shared/buttons/LightButton";
import CreatePostForm from "./CreatePostForm";
import Post from "./Post";
import { usePostContainer } from "./hooks/usePostContainer";
import styles from './styles/postContainerStyles';

function PostContainer() {
    const classes = styles();
    const { user, createPostView, posts, showCreatePostForm } = usePostContainer();

    if (posts.isLoading) return <FullLoadingOverlay />;
    if (posts.isError) return <h1>{posts.error.message}</h1>;

    const CreatePostSection = () => (
        <BoxStyled style={{ margin: "1rem 0" }}>
            <FlexStyled justify="space-between" gap="1rem">
                <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
                <InputStyled
                    variant="unstyled"
                    style={{ width: "100%" }}
                    placeholder="start a topic..."
                    onClick={showCreatePostForm}
                />
                <LightButton name="post" handleClick={showCreatePostForm} />
            </FlexStyled>
        </BoxStyled>
    );

    const PostList = () => {
        if (posts.isLoading) return null;
        return posts.data?.map((post, index) => <Post key={index} post={post} />);
    };

    return (
        <DefaultContainer>
            <CreatePostSection />
            <hr />
            <Conditional isEnabled={createPostView}>
                <CreatePostForm />
            </Conditional>
            <PostList />
        </DefaultContainer>
    );
}

export default PostContainer;