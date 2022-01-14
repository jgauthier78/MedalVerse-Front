
import { Card } from "react-bootstrap";
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

                                        <h1 className="display-4">{"Trophy Factory"}</h1>
                                        <h3 className="lead">
                                            {"MedalVerse permet de créer des récompenses sous forme de NFT, de les distribuer, et de les afficher dans des galeries de trophées. "}
                                        </h3>

                                    </div>
                                </Col>
                                <Col className="col-sm ">
                                    <Card className="bg-default shadow border-0 m-6">

                                        <video

                                            autoPlay="autoplay"
                                            playsInline="playsinline"
                                            loop="loop"
                                            muted
                                            id="video-id"
                                            className="Card-Video-trophy " >

                                            <source src='img/trophee.mov' type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>

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