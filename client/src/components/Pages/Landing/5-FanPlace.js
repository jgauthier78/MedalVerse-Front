import { Badge } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import OkIcon from "../../icons/OkIcon";
import NavigateButton from "../../UIElements/NavigateButton";

const FanPlace = () => {
    return (
        <section id="fan" className="section section-lg mt-8 Container-Full">
            <Container>
                <Row className="row-grid align-items-center mb-8 ">
                    <Col className="order-md-2" md="6">
                        <img
                            alt="..."
                            className="img-fluid floating roundedImage"
                            src="/img/runner.jpg"
                        />
                    </Col>
                    <Col className="order-md-1" md="6">
                        <div className="pr-md-5">
                            <h1>{"Fan Place"}</h1>
                            <p className="description mt-3">
                                {"La Fan Place est le lieu de rencontre des sportifs et de leurs fans."}
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
                                                {"Exposez vos médailles."}
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
                                            <h6 className="mb-0">{"Communiquez vos participations à des compétitions."}</h6>
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
                                                {"Montrez vos succès."}
                                            </h6>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
                <NavigateButton linkTo="galerie" up="false" />
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

export default FanPlace
