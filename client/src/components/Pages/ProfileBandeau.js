import { Component } from "react";
import { Card } from "react-bootstrap";
import { Container, Row, Table } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import CardHeader from "react-bootstrap/esm/CardHeader";

class ProfileBandeau extends Component {

    render() {
        return (
            <Container className="col-md-10 mt-4 ">
                <Card className="cardProfile shadow-sm ">
                    <CardHeader>
                        <div className="d-flex justify-content-between my-auto">
                            <div className="d-flex flex-row align-items-center justify-content-center">
                                <img src={this.props.AppCallBacks.getUserDetails().iconURI} className="profileImage mt-3 shadow" />
                                <div className="ms-2 c-details">
                                    <h6 className="mb-0">{this.props.AppCallBacks.getUserDetails().userName}</h6>
                                </div>
                            </div>

                        </div>

                    </CardHeader>
                    <Row className="container-fluid mt-4 mb-4">

                        <Col className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-4 text-white ">
                            <Table bordered >
                                <tbody>
                                    <tr>

                                        <td colSpan="3">{this.props.AppCallBacks.getAccounts()}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Mail</b></td>
                                        <td colSpan="2">{this.props.AppCallBacks.getUserDetails().email} </td>

                                    </tr>
                                    <tr>
                                        <td><b>{"Rôle"}</b></td>
                                        <td colSpan="2">{this.props.AppCallBacks.getRoleString()}</td>
                                    </tr>

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card>
            </Container>
        )
    }
}

export default ProfileBandeau