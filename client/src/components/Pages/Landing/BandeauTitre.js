// React - Bootstrap
import { Container, Row, Col, Button } from "react-bootstrap";

// Toastify
import 'react-toastify/dist/ReactToastify.css';
import NavScroll from "../../UIElements/NavLink";
// Translation
import { useTranslation } from 'react-i18next';

// Components
import BkgVideo from '../../UIElements/BkgVideo';
import NavigateButton from '../../UIElements/NavigateButton';

// Icons
import { BoxArrowInRight } from 'react-bootstrap-icons';

const BandeauTitre = ({ AppCallBacks, loginCallBack }) => {
    const { t } = useTranslation();

    return (
        <div id="Titre" className="Container-Full">


            <BkgVideo videoSource='img/bkg1.mkv' options="Background-Video" />

            <Container className="  d-flex">
                <div className="col px-0">
                    <Row className='justify-content-between'>
                        <Col lg="6">
                            <div>

                                <img src="img/MedalVerse.svg" className="Titre-MedalVerse" alt={t("bandeauTitre.title")} />
                            </div>
                            <div>
                                <span className="display-4 text-white text-light">{"Entrez dans l'Univers"}<br />{"Des récompenses NFT"}</span>
                            </div>
                        </Col>

                        <Col className="col-2 d-flex justify-content-center">
                            <div className=''>
                                <NavScroll label={t("LandingPage.menu.presentation")} linkTo="pres" white={true} />
                                <NavScroll label={t("LandingPage.menu.trophy")} linkTo="trophy" white={true} />
                                <NavScroll label={t("LandingPage.menu.creation")} linkTo="creation" white={true} />
                                <NavScroll label={t("LandingPage.menu.fanplace")} linkTo="fan" white={true} />
                                <NavScroll label={t("LandingPage.menu.gallery")} linkTo="galerie" white={true} />
                                <NavScroll label={t("LandingPage.menu.roadmap")} linkTo="timeline" white={true} />
                                {AppCallBacks.isConnected() ?
                                    <Button className="text-light btn-landing" variant="outline-secondary" onClick={AppCallBacks.disconnect}>{t("menu.LogoutButton")} <BoxArrowInRight style={{ verticalAlign: '-10%' }} /></Button>
                                    :
                                    <Button className="text-light  btn-landing" variant="outline-secondary" onClick={loginCallBack}><BoxArrowInRight style={{ verticalAlign: '-10%' }} /> {t("menu.LoginButton")}</Button>
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