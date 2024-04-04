import React from "react";
import { Box, Container, Input, Loader, LoadingOverlay } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";

import styles from "./styles/searchbarStyles";

function SearchContainer() {

    const classes = styles();

    return (
        <Container size="600px" style={{ marginTop: "1rem" }}>
            <Box className={classes.searchbar}>
                <PiMagnifyingGlassBold className={classes.searchIcon} />
                <Input
                    variant="unstyled"
                    className={classes.searchInput}
                    placeholder="search a topic..."
                />
                <PiMicrophone className={classes.searchIcon} />
            </Box>
        </Container>
    )
}

export default SearchContainer