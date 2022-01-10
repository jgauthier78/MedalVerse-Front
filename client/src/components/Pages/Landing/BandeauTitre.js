
import 'react-toastify/dist/ReactToastify.css';


import { Container, Row, Col, Button } from "react-bootstrap";
import BkgVideo from '../../UIElements/BkgVideo';
import { BoxArrowInRight, Trophy } from 'react-bootstrap-icons';
import NavigateButton from '../../UIElements/NavigateButton';


const BandeauTitre = ({ AppCallBacks, loginCallBack }) => {
    return (
        <div id="Titre" className="Container-Full">


            <BkgVideo videoSource='img/bkg1.mkv' options="Background-Video" />

            <Container className="  d-flex">
                <div className="col px-0">
                    <Row className='justify-content-between'>
                        <Col lg="6">
                            <div>
                                <Trophy size="40" color='white' />
                                <img src="img/MedalVerse.svg" className="Titre-MedalVerse" alt="MedalVerse" />
                            </div>
                            <div>
                                <span className="display-6 text-white text-light">{"Entrez dans l’univers des Récompenses NFT"} </span>

                            </div>
                        </Col>
                        <Col className="col-2 d-flex justify-content-center">
                            <div className='mt-8'>
                                {AppCallBacks.isConnected() ?
                                    <Button className="text-light" onClick={AppCallBacks.disconnect}>{"Se Déconnecter"} <BoxArrowInRight style={{ verticalAlign: '-10%' }} /></Button>
                                    :
                                    <Button className="text-light " onClick={loginCallBack}><BoxArrowInRight style={{ verticalAlign: '-10%' }} /> {"Se Connecter"}</Button>
                                }
                            </div>

                        </Col>
                    </Row>

                </div>

            </Container>
            <NavigateButton linkTo="pres" up="false" />
        </div>


    )
}



export default BandeauTitre