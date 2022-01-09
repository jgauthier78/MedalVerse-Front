
import { Card, CardImg } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import NavigateButton from "../../UIElements/NavigateButton";


const TrophyFactory = () => {
    return (
        <>
            <div id="trophy" className="section section-lg  bg-light-gray Container-Full">
                <div className=" ">

                    <Container className="Separator-Gutter d-flex">
                        <div className="col px-0">
                            <Row >
                                <Col className="col-sm align-self-center">
                                    <div className="pl-md-5">

                                        <h1>{"Trophy Factory"}</h1>
                                        <p className="lead">
                                            {"MedalVerse permet de créer des récompenses sous forme de NFT, de les distribuer, et de les afficher dans des galeries de trophées. "}
                                        </p>

                                    </div>
                                </Col>
                                <Col className="col-sm ">
                                    <Card className="bg-default shadow border-0 m-6">
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

                            </Row>

                        </div>
                        <NavigateButton linkTo="creation" up="false" />
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
                                    className="fill-black"
                                    points="2560 0 2560 100 0 100"
                                />
                            </svg>
                        </div>
                    </Container>
                </div>

            </div>

        </>
    )
}



export default TrophyFactory