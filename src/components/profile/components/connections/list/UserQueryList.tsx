import BoxStyled from "@/components/shared/BoxStyled";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Typography from "@/components/shared/Typography";
import React from "react";
import styles from "./styles/userListStyles";
import { UserListProps } from "./types/userListTypes";



const UserQueryList: React.FC<UserListProps> = ({ userFetch, queryResult, Item }) => {

    const classes = styles();

    const RenderResult = () => (
        userFetch.isPending ? <FullLoadingOverlay />
            : userFetch.isError ? <Typography type="h1">{userFetch.error.message}</Typography>
                : queryResult.map((data, key) => <Item key={key} data={data} />)
    )

    return <BoxStyled className={classes.resultContainer}><RenderResult /></BoxStyled>
}

export default UserQueryList