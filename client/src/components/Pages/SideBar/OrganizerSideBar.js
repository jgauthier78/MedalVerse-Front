import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container';
// import ListGroup from 'react-bootstrap/ListGroup';
import { NavDropdown, Nav, Navbar, NavItem } from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup'

import {
    // Routes,
    // Route,
    Link,
    // Outlet
  } from "react-router-dom";

  {/*}
        <nav>
            <ul>
                <li>
                    <Link to="/organizer">Organizer home</Link>
                </li>
                <li>
                    <Link to="events">Evenements</Link>
                </li>
            </ul>
        </nav>



<ListGroup>
            <ListGroup.Item><Link to="/organizer">Organizer home</Link></ListGroup.Item>
            <ListGroup.Item><Link to="events">Evenements</Link></ListGroup.Item>
        </ListGroup>


{*/}
function OrganizerSideBarContent() {
    return (

        <nav>
            <ul>
                <li>
                    <Link to="/organizer">Organizer home</Link>
                </li>
                <li>
                    <Link to="events">Evenements</Link>
                </li>
            </ul>
        </nav>

    );



/*
        <Container className="text-dark" variant="bg-dark">
            <ListGroup>
            <ListGroup.Item><Link to="invoices">Evenements</Link> |{" "}</ListGroup.Item>
            <ListGroup.Item><Link to="dashboard">Dashboard</Link></ListGroup.Item>
            </ListGroup>
        </Container>
*/
  }



const OrganizerSideBar = () => (
        <Col className="col-auto col-md-2 col-xl-1 px-sm-2 px-0 colored-Sidebar verticalSeparator-left ">
        <Row className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 sidebarText min-vh-100">
            <Col ><OrganizerSideBarContent/></Col>
            
        </Row>
        </Col>
)
{/*}
    <Col className="col-auto col-md-2 col-xl-1 px-sm-2 px-0 colored-Sidebar verticalSeparator-left">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 sidebarText min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-5 d-none d-sm-inline mt-2 sidebarText">Menu</span>
            </a>
            <div><OrganizerSideBarContent/></div>
        </div>
    </Col>
{*/}

/*
const OrganizerSideBarNew = () => (
    <>
    <Nav className="col-md-12 d-none d-md-block bg-light sidebar" activeKey="/" onSelect={selectedKey => alert(`selected ${selectedKey}`)} >
        <div className="sidebar-sticky"></div>
        <Layout/>
    </Nav>
  </>
)
*/
export default OrganizerSideBar