import { Badge } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import OkIcon from "../../icons/OkIcon";

const TroisiemeBandeau = () => {
    return (
        <section className="section section-lg ">
            <Container>
                <Row className="row-grid align-items-center ">
                    <Col className="order-md-2" md="6">
                        <img
                            alt="..."
                            className="img-fluid floating roundedImage"
                            src="/img/runner.jpg"
                        />
                    </Col>
                    <Col className="order-md-1" md="6">
                        <div className="pr-md-5">
                            <h3>{"Sportifs"}</h3>
                            <p>
                                {"Recevez vos récompenses, exposez les et échangez avec vos fans"}
                            </p>
                            <ul className="list-unstyled mt-5">
                                <li className="py-2">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <Badge
                                                className="badge-circle mr-3"
                                                color="success"
                                            >
                                                <OkIcon size="3" />
                                            </Badge>
                                        </div>
                                        <div>
                                            <h6 className="mb-0">
                                                {"Une médaille NFT dont l'origine est contrôlable"}
                                            </h6>
                                        </div>
                                    </div>
                                </li>
                                <li className="py-2">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <Badge
                                                className="badge-circle mr-3"
                                                color="success"
                                            >
                                                <OkIcon size="3" />
                                            </Badge>
                                        </div>
                                        <div>
                                            <h6 className="mb-0">{"Une galerie dynamiqe paramétrable"}</h6>
                                        </div>
                                    </div>
                                </li>
                                <li className="py-2">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <Badge
                                                className="badge-circle mr-3"
                                                color="success"
                                            >
                                                <OkIcon size="3" />
                                            </Badge>
                                        </div>
                                        <div>
                                            <h6 className="mb-0">
                                                {"Une médaille qui a de la valeur"}
                                            </h6>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
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
                            className="fill-gray"
                            points="2560 0 2560 100 0 100"
                        />
                    </svg>
                </div>
            </Container>
        </section>
    )
}

export default TroisiemeBandeau