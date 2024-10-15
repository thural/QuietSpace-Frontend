import BoxStyled from "@shared/BoxStyled";
import ComponentList from "@shared/ComponentList";
import FullLoadingOverlay from "@shared/FullLoadingOverlay";
import Typography from "@shared/Typography";
import UserQueryItem from "@shared/UserQueryItem";
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