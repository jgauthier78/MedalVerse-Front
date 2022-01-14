
import 'react-toastify/dist/ReactToastify.css';



import { Container, Row, Col } from "react-bootstrap";
// import BkgVideo from '../../UIElements/BkgVideo';
import { Trophy } from 'react-bootstrap-icons';
import NavigateButton from '../../UIElements/NavigateButton';


const BandeauPres = () => {
    return (
        <section id="pres" className="section section-lg Container-Full bkg-gradient">

            <Container className=' Full-Section ' >
                <Row className="row-grid align-items-center mb-6">
                    <Col className="col-sm align-self-center">
                        <div>

                            <div>

                                <img src="img/MedalVerse.svg" className="Titre-MedalVerse" alt="MedalVerse" />
                            </div>

                        </div>
                    </Col>
                    <Col className="col-sm">
                        <div className="pl-md-3 ">


                            <p className=" MedalDescription justify-text">
                                {"MedalVerse permet de créer des récompenses sous forme de NFT, et de les distribuer à ceux qui les remportent."}
                            </p>
                            <p className=" MedalDescription justify-text">
                                {" Mais un trophée est fait pour être montré et partagé, et MedalVerse vous permettra d’exposer toutes vos récompenses dans une galerie. L’immersion de vos visiteurs sera renforcée avec la personnalisation unique qui pourra être donnée à votre galerie."}
                            </p>
                            <p className=" MedalDescription justify-text">
                                {"Nous avons créé une marketplace dans laquelle les sportifs pourront partager avec leurs fans des objets uniques basés sur leurs exploits. "}
                            </p>
                            <a className="ca3-scroll-down-link ca3-scroll-down-arrow" data-ca3_iconfont="ETmodules" data-ca3_icon="" ></a>
                        </div>

                    </Col>
                    <NavigateButton linkTo="trophy" up="false" />

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
            </Container >
        </section >


    )
}


/*
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
*/

export default BandeauPres