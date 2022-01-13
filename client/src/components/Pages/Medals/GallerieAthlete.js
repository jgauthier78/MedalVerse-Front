import React, { Component } from "react";

import { Button, Card, Container/*, Row*/, Col } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
// import Reveal from 'reveal.js';
import { Navigate } from "react-router-dom";
import Iframe from 'react-iframe'
import ClipboardCopy from "../../UIElements/ClipboardCopy"
class GallerieAthlete extends Component {

    state = {
        redirectTo: null
    }

    render() {
        if (this.props.userProfile.userMedals.nbMedalsInGallery === 0) return (<></>)
        if (this.state.redirectTo != null) return (<Navigate to={this.state.redirectTo} />)
        return (
            <Container className="col-md-9 col-lg-8 col-xl-8 mt-5 mb-5 col-align-items-center">
                <Iframe url={"Gallerie/" + this.props.userProfile.address}
                    width="100%"
                    height="650px"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative"
                    allowFullScreen
                    className="mb-5"
                />
                <Card className="cardProfile shadow-sm ">
                    <CardHeader>
                        <h6>{"Ma Gallerie"}:</h6> <span> {this.props.userProfile.userMedals.nbMedals} {" Médaille(s)"} </span>
                    </CardHeader>
                    <Col className="mt-5 ">
                        <h7>Visualiser la gallerie dans une nouvelle page:</h7>
                        <Button className="ml-3" onClick={() => window.open("Gallerie/" + this.props.userProfile.address, "_blank")}
                        >Gallerie</Button>
                    </Col>
                    <Col className="mb-5">
                        <ClipboardCopy copyText={window.location.href + "Gallerie/" + this.props.userProfile.address} />
                    </Col>
                </Card>


            </Container>

        )
    }
}

export default GallerieAthlete