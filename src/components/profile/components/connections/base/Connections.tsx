import { Center } from "@mantine/core";
import { useState } from "react";

import BoxStyled from "@shared/BoxStyled";
import Overlay from "@shared/Overlay";
import Typography from "@shared/Typography";
import UserList from "../list/UserList";
import SearchBar from "../searchbar/SearchBar";
import styles from "./styles/connectionStyles";

function Connections({ userFetch, title }) {

    const classes = styles();

    const [queryResult, setQueryResult] = useState(userFetch.data);


    const filterByQuery = (value) => {
        return userFetch?.data?.content
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