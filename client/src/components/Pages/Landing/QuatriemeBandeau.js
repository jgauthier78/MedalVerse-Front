import React, { Fragment, Component } from "react";
import {
    Button, Card, CardImg,
    Badge
} from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";


export default () => {
    return (
        <section className="section bg-light-gray">
            <Container>
                <Row className="row-grid align-items-center mt-6">
                    <Col md="4">
                        <Card className="bg-default shadow border-0">
                            <CardImg

                                alt="..."
                                src="img/worktogether.jpg"

                            />
                            <blockquote className="card-blockquote">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="svg-bg"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 583 95"
                                >
                                    <polygon
                                        className="fill-default"
                                        points="0,52 583,95 0,95"
                                    />

                                </svg>
                                <h4 className=" font-weight-bold text-white">
                                    {"Un succès d'équipe"}
                                </h4>
                                <p className="lead text-italic text-white">
                                    {"Travaillons ensemble dans un esprit sportif pour mettre en valeur vos projets."}
                                </p>
                            </blockquote>
                        </Card>
                    </Col>
                    <Col md="6">
                        <div className="pl-md-5">

                            <h4>{"Organisateurs: Rejoignez-nous !"}</h4>
                            <p className="lead">
                                {"Annoncez vos nouvelles compétitions, et rendez-les accessibles à tous nos sportifs - créez facilement vos médailles en piochant dans notre marketplace - Remettez vos médailles en ligne, et faites en un événement. La médaille NFT vous simplifie la vie: une création aisée, une personnalisation simplifiée et la possibilité d'y affecter une dotation"}
                            </p>

                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}