/* React */
import React from "react";

/* React - Bootstrap*/
import { Container, NavDropdown, Nav, Navbar, NavItem } from "react-bootstrap";

// import { Link } from "react-router-dom"
import { LinkContainer } from 'react-router-bootstrap'

/* Translation */
import { useTranslation } from 'react-i18next';


/* Icônes */
import { Trophy } from 'react-bootstrap-icons';

/* CSS */
import "../../styles/NavBar.css";
import { Button } from "react-bootstrap";

const NavBar = ({ connectedAccountAddr, loginCallBack }) => {
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

    <Navbar className="colored-Nav" expand="lg"  >
      <Container>

        <Navbar.Brand href="/" className={textStyleCentered}><Trophy style={{ verticalAlign: '-10%' }} /> {t("menu.title")}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="me-auto">

            <LinkContainer to="/">
              <Nav.Link className={textStyleCentered}>{t("menu.home")}</Nav.Link>
            </LinkContainer>

            <LinkContainer to={"/profile/" + connectedAccountAddr}>
              <Nav.Link className={textStyleCentered}>{t("menu.profile")}</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/simpleStorage">
              <Nav.Link className={textStyleCentered}>{t("menu.simpleStorage")}</Nav.Link>
            </LinkContainer>

            <Nav.Link href="#link" className={textStyleCentered}>Link</Nav.Link>

            <NavDropdown menuVariant="dark" title={t("menu.dropdown1.title")} id="navbar-menu-nav-dropdown" >
              <NavDropdown.Item href="/" className={textStyleLeft}>{t("menu.home")}</NavDropdown.Item>
              <NavDropdown.Item href="/profile/Toto" className={textStyleLeft}>{t("menu.profile")}</NavDropdown.Item>
              <NavDropdown.Item href="/simpleStorage" className={textStyleLeft}>{t("menu.simpleStorage")}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/" className={textStyleLeft}>{t("menu.home")}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="align-items-lg-center ml-lg-auto" navbar>
            <NavItem className="d-none d-lg-block ml-lg-4">
              <Button className={textStyleRight} onClick={loginCallBack} >{t("menu.LoginButton")}</Button>
            </NavItem>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  ); // render

} // NavBar

export default NavBar;