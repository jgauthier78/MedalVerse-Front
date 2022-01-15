// React - Bootstrap
import { Container,/*NavDropdown,*/ Nav, Navbar, NavItem, NavDropdown } from "react-bootstrap";

// import { Link } from 'react-scroll'

// Translation
import { useTranslation } from 'react-i18next';
import i18n from '../../utils/i18n';

// Icons
import { BoxArrowInRight, BoxArrowRight, Trophy } from 'react-bootstrap-icons';

// CSS
import "../../styles/NavBar.css";
import { Button } from "react-bootstrap";

// React-Router
// import { Link } from "react-router-dom"; // a retirer ?

// React-Router Bootstrap
import { LinkContainer } from 'react-router-bootstrap'


import NavScroll from "./NavLink";

import { ReactComponent as FR_FLAG } from './../flags/FR.svg';
import { ReactComponent as ENGLISH_FLAG } from './../flags/English_language.svg';

const NavBar = ({ loginCallBack, options, AppCallBacks, isLanding, isAthlete, isOrganizer, setPannel }) => {

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

            {isLanding === true ? (
              <>
                <NavScroll label={t("LandingPage.menu.presentation")} linkTo="pres" />
                <NavScroll label={t("LandingPage.menu.trophy")} linkTo="trophy" />
                <NavScroll label={t("LandingPage.menu.creation")} linkTo="creation" />
                <NavScroll label={t("LandingPage.menu.fanplace")} linkTo="fan" />
                <NavScroll label={t("LandingPage.menu.gallery")} linkTo="galerie" />
                <NavScroll label={t("LandingPage.menu.roadmap")} linkTo="timeline" />

              </>
            )
              : (<></>)
            }
            {isAthlete === true ? (
              <>
                <Nav.Link className={textStyleCentered} onClick={() => { window.scroll(0, 0); setPannel(0) }}>{"Mon Profil"}</Nav.Link>
                <Nav.Link className={textStyleCentered} onClick={() => { window.scroll(0, 0); setPannel(1) }}>{"Mes Evénements"}</Nav.Link>
                <Nav.Link className={textStyleCentered} onClick={() => { window.scroll(0, 0); setPannel(2) }}>{"Ma Galerie"}</Nav.Link>
              </>
            )
              : (<></>)
            }
            {isOrganizer === true ? (
              <>
                <LinkContainer to="/organizer" className="text-bold text-light text-center nav-link"><Nav.Link style={{ color: 'white' }}>{t("OrganizerNavbar.menu.organizerHome")}</Nav.Link></LinkContainer>
                <LinkContainer to="onlyCurrentEvents" className="text-light text-center nav-link" ><Nav.Link>{t("OrganizerNavbar.menu.onlyCurrentEvents")}</Nav.Link></LinkContainer>
                <LinkContainer to="allEventsByState" className="text-light text-center nav-link" ><Nav.Link>{t("OrganizerNavbar.menu.allEventsByState")}</Nav.Link></LinkContainer>
                <LinkContainer to="allEventsByDate" className="text-light text-center nav-link" ><Nav.Link>{t("OrganizerNavbar.menu.allEventsByDate")}</Nav.Link></LinkContainer>
              </>
            )
              : (<></>)
            }
            <NavDropdown title={t("LandingPage.menu.language")} id="basic-nav-dropdown" >
              {i18n.language !== 'en'
                &&
                <NavDropdown.Item style={{ padding: '0px 0px 0px 20px' }} onClick={() => changeLanguage('en')}><ENGLISH_FLAG style={{ width: '110px', height: '110px' }} /></NavDropdown.Item>
              }
              {i18n.language === 'en'
                &&
                <NavDropdown.Item style={{ padding: '0px 0px 0px 20px' }} onClick={() => changeLanguage('fr-FR')}><FR_FLAG style={{ width: '110px', height: '100px' }} /></NavDropdown.Item>
              }
            </NavDropdown>

          </Nav>

          <Nav className="align-items-lg-center ml-lg-auto" navbar>
            {AppCallBacks.isConnected() ?
              <Nav.Link className={textStyleCentered}>{AppCallBacks.getUserDetails().userName}</Nav.Link>
              :
              <></>
            }
            <NavItem className="d-none d-lg-block ml-lg-4">
              {AppCallBacks.isConnected() ?
                <Button className={textStyleRight} onClick={AppCallBacks.disconnect}><div style={{ fontWeight: 'lighter', fontSize: 'smaller' }}>{AppCallBacks.getAccounts()}</div>{t("menu.LogoutButton")} <BoxArrowRight style={{ verticalAlign: '-10%' }} /></Button>
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