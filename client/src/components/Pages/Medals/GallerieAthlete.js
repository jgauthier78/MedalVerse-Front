import React, { Component } from "react";

import { Button, Card, Container, Row, Col } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import Reveal from 'reveal.js';
import { Navigate } from "react-router-dom";


class GallerieAthlete extends Component {

    state = {
        redirectTo: null
    }

    render() {
        if (this.props.userProfile.userMedals.nbMedalsInGallery === 0) return (<></>)
        if (this.state.redirectTo != null) return (<Navigate to={this.state.redirectTo} />)
        return (
            <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 col-align-items-center">
                <Card className="cardProfile shadow-sm ">
                    <CardHeader>
                        <h6>{"Ma Gallerie"}:</h6> <span> {this.props.userProfile.userMedals.nbMedals} {" Médaille(s)"} </span>
                    </CardHeader>
                    <Col className="mt-5 mb-5">
                        <h7>Visualiser la gallerie dans une nouvelle page:</h7>
                        <Button className="ml-3" onClick={() => window.open("Gallerie/" + this.props.userProfile.address, "_blank")}>Gallerie</Button>
                    </Col>
                </Card>
            </Container>

        )
    }
}

export default GallerieAthlete