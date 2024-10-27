import BoxStyled from "@components/shared/BoxStyled";
import ComponentList from "@components/shared/ComponentList";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import Typography from "@components/shared/Typography";
import UserQueryItem from "@components/shared/UserQueryItem";
import styles from "./styles/queryResultStyles";
import React from "react";
import { UserQueryProps } from "./types/userQueryTypes";


const UserQuery: React.FC<UserQueryProps> = ({ fetchUserQuery, userQueryList, style }) => {

    const classes = styles();

    const RenderResult = () => {
        if (fetchUserQuery.isPending) return <FullLoadingOverlay />;
        if (fetchUserQuery.isError) return <Typography type="h1">{fetchUserQuery.error.message}</Typography>;
        return <ComponentList list={userQueryList} Component={UserQueryItem} />;
    }

    return (
        <BoxStyled className={classes.resultContainer} style={style} >
            <RenderResult />
        </BoxStyled>
    )
};

export default UserQuery