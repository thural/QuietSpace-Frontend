import { Center } from "@mantine/core";
import React, { useState } from "react";

import Overlay from "../Overlay/Overlay";
import BoxStyled from "../Shared/BoxStyled";
import Typography from "../Shared/Typography";
import SearchBar from "./SearchBar";
import styles from "./styles/searchbarStyles";
import UserList from "./UserList";

function Connections({ userFetch, title }) {

    const classes = styles();

    const [queryResult, setQueryResult] = useState(userFetch.data);


    const filterByQuery = (value) => {
        return userFetch.data
            .filter(f => (f.username.includes(value) || f.email.includes(value)));
    }

    const handleInputChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length) {
            setQueryResult(filterByQuery(value));
        } else {
            setQueryResult(userFetch.data);
        }
    }

    const handleItemClick = () => {
        // TODO: implement and call follow feature
    }

    const handleInputFocus = (event) => {
        // TODO: handle query input focus
    }

    const handleInputBlur = () => {
        // TODO: setFocused(false);
    }


    return (
        <>
            <Overlay closable={{ followers: false }} />
            <BoxStyled className={classes.container} >
                <Center><Typography type="h3">{title}</Typography></Center>
                <SearchBar
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    handleInputFocus={handleInputFocus}
                />
                <UserList userFetch={userFetch} queryResult={queryResult} handleItemClick={handleItemClick} />
            </BoxStyled>
        </>
    )
}

export default Connections