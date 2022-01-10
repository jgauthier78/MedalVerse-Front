/* React */
import React from "react";

/* React - Bootstrap*/
import { Container, NavDropdown, Nav, Navbar, NavItem } from "react-bootstrap";

// import { Link } from "react-router-dom"
import { Link } from 'react-scroll'

/* Translation */
import { useTranslation } from 'react-i18next';


/* Icônes */
import { BoxArrowInRight, BoxArrowRight, Trophy } from 'react-bootstrap-icons';

/* CSS */
import "../../styles/NavBar.css";
import { Button } from "react-bootstrap";

const NavBar = ({ connectedAccountAddr, loginCallBack, options, AppCallBacks, isLanding }) => {

  const { t } = useTranslation();
  /*
     return (
      <Container>
        <nav>
          <Link to="/"> {t("menu.home")} </Link>
          <Link to="/profile"> {t("menu.home.profile")} </Link>
          <Link to="/simpleStorage"> {t("menu.home.simpleStorage")} </Link>
        </nav>
    </Container>
  */
  const textStyleCentered = "text-light text-center";
  const textStyleLeft = "text-light text-left";
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
                <Nav.Link className={textStyleCentered}><Link to="pres" spy={true} smooth={false}>{"Présentation"}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="trophy" spy={true} smooth={false}>{"Trophy Factory"}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="creation" spy={true} smooth={false}>{"Creation Factory"}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="fan" spy={true} smooth={false}>{"Fan Place"}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="galerie" spy={true} smooth={false}>{"Galerie"}</Link></Nav.Link>
                <Nav.Link className={textStyleCentered}><Link to="timeline" spy={true} smooth={false}>{"Roadmap"}</Link></Nav.Link>
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