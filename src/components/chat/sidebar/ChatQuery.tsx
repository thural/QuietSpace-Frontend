import { UserResponse } from "@/api/schemas/inferred/user";
import LoaderStyled from "@/components/shared/LoaderStyled";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import AnchorStyled from "@shared/AnchorStyled";
import BoxStyled from "@shared/BoxStyled";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import ChatQueryInput from "./ChatQueryInput";
import UserCard from "../../shared/UserCard";
import useQueryContainer from "@/services/hook/chat/useQueryContainer";
import styles from "@/styles/chat/chatQueryStyles";

const ChatQuery = () => {

    const classes = styles();
    let data = undefined;


    try {
        data = useQueryContainer();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading users: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const {
        queryResult,
        handleChatCreation,
        appliedStyle,
        inputProps,
        makeQueryMutation,
    } = data;


    const RecentQueries = () => {
        return (
            <FlexStyled className={classes.recentQueries}>
                <Typography type="h4">recent</Typography>
                <AnchorStyled label="clear all" />
            </FlexStyled>
        )
    }

    const RenderResult = () => {
        if (makeQueryMutation.isPending) return <LoaderStyled />
        if (queryResult.length === 0) return <RecentQueries />
        return queryResult.map((user: UserResponse, key: number) =>
            <UserCard
                key={key}
                userId={user.id}
                isDisplayEmail={true}
                onClick={(e: React.MouseEvent) => handleChatCreation(e, user)}
            />);
    }

    const QueryPanel = () => {
        return (
            <FlexStyled className={classes.resultContainer} style={appliedStyle} ref={inputProps.resultListRef}>
                <RenderResult />
            </FlexStyled>
        )
    }


    return (
        <BoxStyled
            onFocus={inputProps.handleInputFocus}
            onBlur={inputProps.handleInputBlur}
            className={classes.searchContainer}>
            <ChatQueryInput {...inputProps} />
            <QueryPanel />
        </BoxStyled>
    )
}

export default ChatQuery