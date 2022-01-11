import React, { Component } from "react";

import { Button, Card, Container, Row, Col } from "react-bootstrap";
import NavigateButton from "../../UIElements/NavigateButton";



class EncourageBandeau extends Component {

    state = {
        redirectTo: null
    }

    render() {

        return (
            <div className=" bg-light-gray">
                <img src="img/MedalVerse.svg" className="Titre-MedalVerse mt-5" alt="MedalVerse" />
                <div className="full-width">
                    <Container className=" d-flex ">
                        <Row className="justify-content-center ">
                            <div className="col col-7 mt-4  text-center mb-7">
                                <p className="display-6 text-black text-light mt-6">

                                    {"Vous possédez "}
                                    <span className="luminance-Effect">{this.props.userProfile.userMedals.nbMedals} {"Médailles"}</span>

                                </p>
                                <p className="display-6 text-black text-light">
                                    {"Et particpez à "}
                                    <span className="">{this.props.userProfile.userEvents.nbEvents}
                                        {" événements "}</span>

                                </p>
                                <p className=" EncourageDescription justify-text mt-5 mb-4">
                                    {"Vous possédez des médailles, partagez-les avec vos fans en les publiant sur votre galerie. Pour cela, rendez-vous sur la page dédiée."}
                                </p>
                                <NavigateButton linkTo="medaille" up="false" options="mt-8" />

                            </div>

                        </Row>

                    </Container>

                </div>

            </div>

        )
    }
}

export default EncourageBandeau