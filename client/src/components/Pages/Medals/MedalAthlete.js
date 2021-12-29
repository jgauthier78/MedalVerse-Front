import React, { Component, Table } from "react";
import { Card, Container } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import ThrowInContract from "../../../contracts/ThrowIn.json";

function getNFTImage() {

}


const TableMedalItems = ({ userMedals }) => (
    <tbody>
        {userMedals.Medals.map((medal, indx) => (
            <tr key={indx}>
                <td colSpan="1">
                    {indx + 1}
                </td>
                <td colSpan="1">
                    {medal.org}
                </td>
                <td colSpan="1">
                    {(new Date(Number(medal.event.endDate) * 1000)).toString()}
                </td>
                <td colSpan="1" className="text-center" >
                    {medal.succes.isInWinnerGallery ?
                        <i className="fa fa-check-square-o " aria-hidden="true"></i>
                        :
                        <i className="fa fa-square-o" aria-hidden="true"></i>
                    }
                </td>
            </tr>
        ))}
    </tbody>
)

class MedalAthlete extends Component {
    render() {
        console.log(this.props.userProfile.userMedals)
        return (
            <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 col-align-items-center">
                <Card className="cardProfile shadow-sm ">
                    <CardHeader>
                        <h6>{"Mes Médailles"}:</h6> <span> {this.props.userProfile.userMedals.nbMedals} {" Médaille(s)"} </span>
                    </CardHeader>
                    <table className="table bordered" >
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{"Fédération"}</th>
                                <th scope="col">{"Evénement"}</th>
                                <th scope="col">{"Gallerie"}</th>
                                <th scope="col">{"Image"}</th>
                            </tr>
                        </thead>
                        <TableMedalItems userMedals={this.props.userProfile.userMedals} />
                    </table>

                </Card>
            </Container>

        )
    }
}

export default MedalAthlete