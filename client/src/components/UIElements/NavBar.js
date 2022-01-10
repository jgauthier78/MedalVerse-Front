// React - Bootstrap
import { Container,/*NavDropdown,*/ Nav, Navbar, NavItem, NavDropdown } from "react-bootstrap";

import { Link } from 'react-scroll'

// Translation
import { useTranslation } from 'react-i18next';
import i18n from '../../utils/i18n';

// Icons
import { BoxArrowInRight, BoxArrowRight, Trophy } from 'react-bootstrap-icons';
// CSS
import "../../styles/NavBar.css";
import { Button } from "react-bootstrap";

import {ReactComponent as FR_FLAG} from './../flags/FR.svg';
import {ReactComponent as ENGLISH_FLAG} from './../flags/English_language.svg';

const NavBar = ({ /*connectedAccountAddr,*/ loginCallBack, options, AppCallBacks, isLanding }) => {

  const { t } = useTranslation();
  const changeLanguage = (lng) => { i18n.changeLanguage(lng) }

  const textStyleCentered = "text-light text-center";
  // const textStyleLeft = "text-light text-left";
  const textStyleRight = "text-light text-right";


  return (

    <Navbar className={`colored-Nav fixed-top ${options}`} expand="lg"  >
      <Container>

        <Navbar.Brand href="/" className={textStyleCentered}><Trophy style={{ verticalAlign: '-10%' }} /> {t("menu.title")}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="me-auto">

            {isLanding === "true" ? (
              <>
                <Nav.Link className={textStyleCentered}><Link to="pres" spy={true} smooth={false}>{t("LandingPage.menu.presentation")}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="trophy" spy={true} smooth={false}>{t("LandingPage.menu.trophy")}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="creation" spy={true} smooth={false}>{t("LandingPage.menu.creation")}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="fan" spy={true} smooth={false}>{t("LandingPage.menu.fanplace")}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="galerie" spy={true} smooth={false}>{t("LandingPage.menu.gallery")}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="timeline" spy={true} smooth={false}>{t("LandingPage.menu.roadmap")}</Link></Nav.Link>
                <NavDropdown title={t("LandingPage.menu.language")} id="basic-nav-dropdown" >
                  {i18n.language !== 'en'
                  &&
                  <NavDropdown.Item style={{padding: '0px 0px 0px 20px'}} onClick={() => changeLanguage('en')}><ENGLISH_FLAG style={{  width: '110px', height : '110px' }} /></NavDropdown.Item>
                  }
                  {i18n.language === 'en'
                  &&
                  <NavDropdown.Item style={{padding: '0px 0px 0px 20px'}} onClick={() => changeLanguage('fr-FR')}><FR_FLAG style={{ width: '110px', height : '100px' }} /></NavDropdown.Item>
                  }
                </NavDropdown>
               </>
            )
              : (<></>)
            }


          </Nav>

          <Nav className="align-items-lg-center ml-lg-auto" navbar>
            {AppCallBacks.isConnected() ?

              <Nav.Link className={textStyleCentered}>{AppCallBacks.getUserDetails().userName}</Nav.Link>
              :
              <></>
            }
            <NavItem className="d-none d-lg-block ml-lg-4">
              {AppCallBacks.isConnected() ?
                <Button className={textStyleRight} onClick={AppCallBacks.disconnect}>{t("menu.LogoutButton")} <BoxArrowRight style={{ verticalAlign: '-10%' }} /></Button>
                :
                <Button className={textStyleRight} onClick={loginCallBack}><BoxArrowInRight style={{ verticalAlign: '-10%' }} /> {t("menu.LoginButton")}</Button>
              }
            </NavItem>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  ); // render

} // NavBar

export default NavBar;