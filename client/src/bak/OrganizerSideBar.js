// React-Bootstrap
import { Container, Col, Row, Button } from 'react-bootstrap';
// Translation
import { useTranslation } from 'react-i18next';

// Icons
import { PersonWorkspace, Calendar2Week } from 'react-bootstrap-icons';
// React-Router
import { Link } from "react-router-dom";

const OrganizerSideBarContent = () =>
{
    const { t } = useTranslation();
    return (
    <Container className="d-grid gap-2">
        <Link to="/organizer">
            <Button size="sm" variant="secondary"><PersonWorkspace style={{verticalAlign: '-10%'}}/> {t("OrganizerSideBar.menu.organizerHome")}</Button>
        </Link>
        <Link to="eventsByState">
            <Button size="sm"><Calendar2Week style={{verticalAlign: '-10%'}}/> {t("OrganizerSideBar.menu.eventsByState")}</Button>
        </Link>
        <Link to="eventsByDate">
            <Button size="sm"><Calendar2Week style={{verticalAlign: '-10%'}}/> {t("OrganizerSideBar.menu.eventsByDate")}</Button>
        </Link>
    </Container>
);
} // OrganizerSideBarContent

const OrganizerSideBar = () =>
{
return (
    <Col className="col-auto  px-0 colored-Sidebar verticalSeparator-left ">
        <Row className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 sidebarText min-vh-100">
            <OrganizerSideBarContent/>
        </Row>
    </Col>
    )
} // OrganizerSideBar

export default OrganizerSideBar