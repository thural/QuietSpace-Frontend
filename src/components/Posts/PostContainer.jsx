import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import DefaultContainer from "@shared/DefaultContainer";
import FlexStyled from "@shared/FlexStyled";
import FullLoadingOverlay from "@shared/FullLoadingOverlay";
import InputStyled from "@shared/InputStyled";
import UserAvatar from "@shared/UserAvatar";
import LightButton from "@shared/buttons/LightButton";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import CreatePostForm from "./CreatePostForm";
import Post from "./Post";
import { usePostContainer } from "./hooks/usePostContainer";

function PostContainer() {
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
        return posts?.data.content?.map((post, index) => <Post key={index} post={post} />);
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