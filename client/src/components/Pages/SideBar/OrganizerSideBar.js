

import Col from 'react-bootstrap/Col';


const OrganizerSideBar = () => (
    <Col className="col-auto col-md-2 col-xl-1 px-sm-2 px-0 colored-Sidebar verticalSeparator-left">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 sidebarText min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-5 d-none d-sm-inline mt-2 sidebarText">Menu</span>
            </a>
        </div>
    </Col>
)

export default OrganizerSideBar