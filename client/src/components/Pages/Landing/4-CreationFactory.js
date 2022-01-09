import { Card } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';

import IconPeoples from '../../icons/IconPeoples';
import IconMedal from '../../icons/IconMedal';
import IconDialog from '../../icons/IconDialog';
import BkgVideo from '../../UIElements/BkgVideo';
import { Container, Row, Col } from "react-bootstrap";
import NavigateButton from "../../UIElements/NavigateButton";

const CreationFactory = () => {
    return (
        <section id="creation" className="section section-lg Container-Full ">
            <div>
                <BkgVideo videoSource='img/chrono.webm' options="Background-Video " />
                <Container className="Separator-Gutter d-flex  card-margin-top">
                    <Row className="justify-content-center ">

                        <div className="d-flex justify-content-center cards-margin-title">
                            <h1 className="justify-content-sm-center text-white">{"MedalVerse vous aide à créer vos récompenses"}</h1>
                        </div>
                        <Col lg="12" className="">
                            <Row className="row-grid">
                                <Col lg="4">
                                    <Card className="card-lift--hover  border-0 cardTopMargin card-rounded card-title-color">
                                        <Card.Body className="py-5 text-center">
                                            <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                                                <IconPeoples size="6" />
                                            </div>
                                            <h6 className="text-primary text-uppercase">
                                                {"Design"}
                                            </h6>

                                            <p className="description mt-3">
                                                {"Choisissez un modèle de trophée dans la marketplace MedalVerse"}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col lg="4">
                                    <Card className="card-lift--hover  border-0 card-rounded card-title-color">
                                        <Card.Body className="py-5 text-center">
                                            <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                                                <IconMedal size="6" />
                                            </div>
                                            <h6 className="text-success text-uppercase">
                                                {"Paramétrage"}
                                            </h6>
                                            <p className="description mt-3">
                                                {"Sélectionnez les paramètres du trophée"}
                                            </p>

                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col lg="4">
                                    <Card className="card-lift--hover  border-0 cardTopMargin card-rounded card-title-color">
                                        <Card.Body className="py-5 text-center">
                                            <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                                                <IconDialog size="6" />
                                            </div>
                                            <h6 className="text-warning text-uppercase">
                                                {"Remise de Médaille"}
                                            </h6>
                                            <p className="description mt-3">
                                                {"Transmettez le trophée aux sportifs vainqueurs de la compétition"}
                                            </p>

                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <NavigateButton linkTo="fan" up="false" white="true" />
                    <div className="separator separator-bottom separator-skew">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 100"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="fill-white"
                                points="2560 0 2560 100 0 100"
                            />
                        </svg>
                    </div>
                </Container>
            </div >

        </section >
    )
}

export default CreationFactory