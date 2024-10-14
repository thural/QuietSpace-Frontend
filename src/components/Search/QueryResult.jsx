import BoxStyled from "../Shared/BoxStyled";
import ComponentList from "../Shared/ComponentList";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import Typography from "../Shared/Typography";
import UserQueryItem from "../Shared/UserQueryItem";
import styles from "./styles/queryResultStyles";

const QueryResult = ({ handleItemClick, fetchUserQuery, userQueryList, style }) => {

    const classes = styles();

    const RenderResult = () => {
        if (fetchUserQuery.isPending) return <FullLoadingOverlay />;
        if (fetchUserQuery.isError) return <Typography type="h1">{fetchUserQuery.error.message}</Typography>;
        return <ComponentList list={userQueryList} Component={UserQueryItem} handleItemClick={handleItemClick} />;
    }

    return (
        <BoxStyled className={classes.resultContainer} style={style} >
            <RenderResult />
        </BoxStyled>
    )
};

export default QueryResult