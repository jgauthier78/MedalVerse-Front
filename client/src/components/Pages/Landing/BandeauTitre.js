
import 'react-toastify/dist/ReactToastify.css';


import { Container, Row, Col } from "react-bootstrap";
import BkgVideo from '../../UIElements/BkgVideo';
import { Trophy } from 'react-bootstrap-icons';
import NavigateButton from '../../UIElements/NavigateButton';


const BandeauTitre = () => {
    return (
        <div id="Titre" className="Container-Full">


            <BkgVideo videoSource='img/bkg1.mkv' options="Background-Video" />

            <Container className="  d-flex">
                <div className="col px-0">
                    <Row>
                        <Col lg="6">
                            <div>
                                <Trophy size="40" color='white' />
                                <img src="img/MedalVerse.svg" className="Titre-MedalVerse" alt="MedalVerse" />
                            </div>
                            <div>
                                <span className="display-6 text-white text-light">{"Entrez dans l’univers des Récompenses NFT"} </span>

                            </div>
                        </Col>
                    </Row>
                </div>
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
            <NavigateButton linkTo="pres" up="false" />
        </div>


    )
}



export default BandeauTitre