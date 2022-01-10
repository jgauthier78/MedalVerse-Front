// React - Bootstrap
import { Container, Row, Col } from "react-bootstrap";

// Toastify
import 'react-toastify/dist/ReactToastify.css';

// Translation
import { useTranslation } from 'react-i18next';

// Components
import BkgVideo from '../../UIElements/BkgVideo';
import NavigateButton from '../../UIElements/NavigateButton';

// Icons
import { /*BoxArrowInRight,*/ Trophy } from 'react-bootstrap-icons';

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
                                <Trophy size="40" color='white' />
                                <img src="img/MedalVerse.svg" className="Titre-MedalVerse" alt={t("bandeauTitre.title")} />
                            </div>
                            <div>
                                <span className="display-6 text-white text-light">{t("bandeauTitre.text")}</span>

                            </div>
                        </Col>
{/*}
                        <Col className="col-2 d-flex justify-content-center">
                            <div className='mt-8'>
                                {AppCallBacks.isConnected() ?
                                    <Button className="text-light" onClick={AppCallBacks.disconnect}>{"Se DéconnecterX"} <BoxArrowInRight style={{ verticalAlign: '-10%' }} /></Button>
                                    :
                                    <Button className="text-light " onClick={loginCallBack}><BoxArrowInRight style={{ verticalAlign: '-10%' }} /> {"Se ConnecterX"}</Button>
                                }
                            </div>

                        </Col>
{*/}

                    </Row>

                </div>

            </Container>
            <NavigateButton linkTo="pres" up="false" />
        </div>


    )
}

export default BandeauTitre