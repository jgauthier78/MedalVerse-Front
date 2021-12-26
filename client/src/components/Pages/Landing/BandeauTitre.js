import 'react-toastify/dist/ReactToastify.css';


import { Container, Row, Col } from "react-bootstrap";

const BandeauTitre = () => {
    return (
        <div className="position-relative">
            <section className="section section-lg section-shaped pb-250">
                <div className="shape shape-style-1 shape-default">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <Container className="py-lg-md d-flex">
                    <div className="col px-0">
                        <Row>
                            <Col lg="6">
                                <h1 className="display-3 text-white">
                                    MedalVerse{" "}
                                    <span className="display-6 text-white text-light">{"Vos médailles en Réseau"} </span>
                                    <p className="lead text-white">
                                        {"Le premier réseau social sportif, suivez vos sportifs favoris, suivez les événements, tenez-vous au courant de l'actualité."}
                                    </p>
                                </h1>
                            </Col>
                        </Row>
                    </div>
                </Container>
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

            </section>
        </div>

    )
}

export default BandeauTitre