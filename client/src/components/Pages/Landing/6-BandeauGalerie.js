
import 'react-toastify/dist/ReactToastify.css';
import { Card } from "react-bootstrap";

import { Container, Row, Col } from "react-bootstrap";
import BkgVideo from '../../UIElements/BkgVideo';
import { Trophy } from 'react-bootstrap-icons';
import NavigateButton from '../../UIElements/NavigateButton';


const BandeauGalerie = () => {
    return (
        <section id="galerie" className="section section-lg bkg-gradient Container-Full">
            <Container >
                <Row className="row-grid align-items-center mb-6 justify-content-sm-center">
                    <div className='cards-margin-title-small'>

                        <img src="img/MedalVerse.svg" className="Titre-MedalVerse" alt="MedalVerse" />
                    </div>
                    <div className="d-flex justify-content-center cards-margin-title-small">
                        <h1 className="justify-content-sm-center text-white display-1">{"Créez votre propre galerie"}</h1>
                    </div>
                    <Col lg="4">

                        <Card className="shadow  border-0 card-rounded ">
                            <BkgVideo videoSource='img/trophee.mov' options="Card-Video " />
                            <Card.Body className="py-5 text-center">

                                <h6 className="text-success text-uppercase">
                                    {"Sportifs"}
                                </h6>
                                <p className="description mt-3">
                                    {"Sportifs, venez créer votre galerie et exposez vos trophées. Personnalisez l’expérience que vous allez partager à votre communauté."}
                                </p>

                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card className="shadow  border-0  card-rounded ">
                            <BkgVideo videoSource='img/field.webm' options="Card-Video " />
                            <Card.Body className="py-5 text-center">

                                <h6 className="text-success text-uppercase">
                                    {"Visiteurs"}
                                </h6>
                                <p className="description mt-3">
                                    {"Visiteurs, découvrez au cours d’une expérience immersive les galeries de vos athlètes préférés et de vos amis. Rejoignez-nous mainteant."}
                                </p>

                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
                <NavigateButton linkTo="produit" up="false" />
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
                            className="fill-red"
                            points="2560 0 2560 100 0 100"
                        />
                    </svg>
                </div>
            </Container >
        </section >


    )
}

export default BandeauGalerie