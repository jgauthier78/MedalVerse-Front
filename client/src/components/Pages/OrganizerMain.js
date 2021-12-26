// import React from "react";
import { Container } from "react-bootstrap";
import { Profile } from "../Profile";

const OrganizerMain = ( { handleSaveProfile, profile } ) => {
    return (

        <Container fluid>

            <Container fluid>
            <p>Organizer Main</p>
            </Container>
        <Profile handleSaveProfile={handleSaveProfile} profile={profile} />

        </Container>

    )
}

export default OrganizerMain