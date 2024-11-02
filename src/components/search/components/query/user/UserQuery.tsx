import ErrorComponent from "@/components/shared/error/ErrorComponent";
import BoxStyled from "@components/shared/BoxStyled";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import UserQueryItem from "@components/shared/UserQueryItem";
import React from "react";
import styles from "./styles/queryResultStyles";
import { UserQueryProps } from "./types/userQueryTypes";


const UserQuery: React.FC<UserQueryProps> = ({ fetchUserQuery, userQueryList, style }) => {

    const classes = styles();

    const RenderResult = () => {
        if (fetchUserQuery.isPending) return <FullLoadingOverlay />;
        if (fetchUserQuery.isError) return <ErrorComponent message={fetchUserQuery.error.message} />;
        return userQueryList.map((user, key) => <UserQueryItem key={key} user={user} />);
    }

    return (
        <BoxStyled onClick={(e: Event) => e.preventDefault()} className={classes.resultContainer} style={style} >
            <RenderResult />
        </BoxStyled>
    )
};

export default UserQuery