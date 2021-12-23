import React, { Fragment, Component } from "react";
import {
    Button, Card,
    Badge
} from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';

import IconPeoples from '../../icons/IconPeoples';
import IconMedal from '../../icons/IconMedal';
import IconDialog from '../../icons/IconDialog';

import { Container, Row, Col } from "react-bootstrap";

const SecondBandeau = () => {
    return (
        <section className="section section-lg pt-lg-0 mt--200">
            <Container>
                <Row className="justify-content-center">
                    <Col lg="12">
                        <Row className="row-grid">
                            <Col lg="4">
                                <Card className="card-lift--hover shadow border-0 cardTopMargin">
                                    <Card.Body className="py-5 text-center">
                                        <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                                            <IconPeoples size="6" />
                                        </div>
                                        <h6 className="text-primary text-uppercase">
                                            {"Podium en Ligne"}
                                        </h6>

                                        <p className="description mt-3">
                                            {"Restez informé des derniers résultats, obtenez vos médailles et consultez les événements à venir"}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg="4">
                                <Card className="card-lift--hover shadow border-0">
                                    <Card.Body className="py-5 text-center">
                                        <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                                            <IconMedal size="6" />
                                        </div>
                                        <h6 className="text-success text-uppercase">
                                            {"Médailles NFT"}
                                        </h6>
                                        <p className="description mt-3">
                                            {"Vos médailles ont de la valeur ! Exposez-les en galerie, ou échangez et vendez pour financer vos prochains exploits"}
                                        </p>

                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg="4">
                                <Card className="card-lift--hover shadow border-0 cardTopMargin">
                                    <Card.Body className="py-5 text-center">
                                        <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                                            <IconDialog size="6" />
                                        </div>
                                        <h6 className="text-warning text-uppercase">
                                            {"Suivez vos Héros"}
                                        </h6>
                                        <p className="description mt-3">
                                            {"Visitez les galeries des sportifs les plus connus, abonnez-vous pour ne rien manquer. Collectionnez les NFTs que vous aimez."}
                                        </p>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default SecondBandeau