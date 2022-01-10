// React - Bootstrap
import { Container, Row, Col } from "react-bootstrap";

// Icons
import { Facebook, Google, Instagram, Linkedin, Pinterest, Twitter } from 'react-bootstrap-icons';

// Translation
import { useTranslation } from 'react-i18next';

// Components
import NavigateButton from "../../UIElements/NavigateButton";

const QuatriemeBandeau = () => {
    const { t } = useTranslation();
    
    return (
        <section id="communeaute" className="section Blue-Bkg">
            <Container>
                <Row className="row-grid align-items-center mt-6">
                    <div md="4">
                        <h1 className="display-1 text-white d-flex justify-content-center">{t("QuatriemeBandeau.title")}</h1>
                        <h4 className="text-gray d-flex justify-content-center">{t("QuatriemeBandeau.text")}</h4>
                    </div>
                    <div className="d-flex justify-content-center mt-8">

                        <Facebook size="40" color='white' className="social-spacing" />
                        <Twitter size="40" color='white' className="social-spacing" />
                        <Google size="40" color='white' className="social-spacing" />
                        <Instagram size="40" color='white' className="social-spacing" />
                        <Linkedin size="40" color='white' className="social-spacing" />
                        <Pinterest size="40" color='white' />

                    </div>
                    <NavigateButton linkTo="Titre" up="false" options="mt-6" white="true" />
                </Row>
            </Container>
        </section>
    )
}
export default QuatriemeBandeau