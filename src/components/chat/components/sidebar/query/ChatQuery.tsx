import AnchorStyled from "@shared/AnchorStyled";
import BoxStyled from "@shared/BoxStyled";
import ComponentList from "@shared/ComponentList";
import FlexStyled from "@shared/FlexStyled";
import FullLoadingOverlay from "@shared/FullLoadingOverlay";
import Typography from "@shared/Typography";
import QueryInput from "./QueryInput";
import UserCard from "./UserCard";
import useQueryContainer from "./hooks/useQueryContainer";
import styles from "./styles/chatQueryStyles";
import ErrorComponent from "@/components/shared/error/ErrorComponent";

const ChatQuery = () => {

    const classes = styles();


    let data = undefined;

    try {
        data = useQueryContainer();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading users: ${(error as Error).message}`
        return <ErrorComponent message={errorMessage} />
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
        if (makeQueryMutation.isPending) return <FullLoadingOverlay />
        if (queryResult.length === 0) return <RecentQueries />
        return <ComponentList list={queryResult} Component={UserCard} handleItemClick={handleChatCreation} />;
    }

    const QueryResult = () => {
        return (
            <BoxStyled className={classes.resultContainer} style={appliedStyle}>
                <RenderResult />
            </BoxStyled>
        )
    }


    return (
        <BoxStyled className={classes.searchContainer}>
            <QueryInput {...inputProps} />
            <QueryResult />
        </BoxStyled>
    )
}

export default ChatQuery