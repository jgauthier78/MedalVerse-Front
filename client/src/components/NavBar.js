/* React */
import React from "react";

/* React - Bootstrap*/
import Container from "react-bootstrap/esm/Container";

import Navbar from 'react-bootstrap/Navbar'

import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

// import { Link } from "react-router-dom"
import { LinkContainer } from 'react-router-bootstrap'

/* Translation */
import { useTranslation } from 'react-i18next';


/* Icônes */
import { Trophy } from 'react-bootstrap-icons';

/* CSS */
import "../styles/NavBar.css";

const NavBar = ( /* {  } */ ) =>
{
  const { t } = useTranslation() ;
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

return (
  
  <Navbar bg="dark" expand="lg"  >
    <Container>

      <Navbar.Brand href="#home" className={textStyleCentered}><Trophy style={{verticalAlign: '-10%'}}/> {t("menu.title")}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">

        <Nav className="me-auto">

          <LinkContainer to="/">
            <Nav.Link className={textStyleCentered}>{t("menu.home")}</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/profile">
            <Nav.Link className={textStyleCentered}>{t("menu.profile")}</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/simpleStorage">
            <Nav.Link className={textStyleCentered}>{t("menu.simpleStorage")}</Nav.Link>
          </LinkContainer>

          <Nav.Link href="#link" className={textStyleCentered}>Link</Nav.Link>

          <NavDropdown menuVariant="dark" title={t("menu.dropdown1.title")} id="navbar-menu-nav-dropdown" >
            <NavDropdown.Item href="/" className={textStyleLeft}>{t("menu.home")}</NavDropdown.Item>
            <NavDropdown.Item href="/profile" className={textStyleLeft}>{t("menu.profile")}</NavDropdown.Item>
            <NavDropdown.Item href="/simpleStorage" className={textStyleLeft}>{t("menu.simpleStorage")}</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/" className={textStyleLeft}>{t("menu.home")}</NavDropdown.Item>
          </NavDropdown>

        </Nav>

      </Navbar.Collapse>
    </Container>
  </Navbar>
  ); // render

} // NavBar

export { NavBar } ;