import React, { Component } from "react";
import { Card, Container } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import ReactTooltip from "react-tooltip";
import { format_Date } from "../../../utils/dateUtils";
async function setGallery(AppCallBacks, addr, contract, indx, display, succes) {
    try {
        await contract.methods.publishMedal(indx, display).send({ from: addr[0] })
        AppCallBacks.updateUserDetails()
    }
    catch (err) {
        console.log(err)
    }

}

const TableMedalItems = ({ AppCallBacks, address, contract, web3, userMedals }) => {

    return (
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
                        {format_Date(medal.event.endDate)}
                    </td>
                    <td colSpan="1" className="text-center" >
                        {medal.succes.isInWinnerGallery ?
                            <button type="button" onClick={async () => await setGallery(AppCallBacks, address, contract, indx, false, medal.succes)} className="btn btn-link"><i className="fa fa-check-square-o " aria-hidden="true"></i></button>
                            :
                            <button type="button" onClick={async () => await setGallery(AppCallBacks, address, contract, indx, true, medal.succes)} className="btn btn-link"><i className="fa fa-square-o" aria-hidden="true"></i></button>
                        }
                    </td>
                    <td colSpan="1">
                        <img src={userMedals.uriList[indx]} style={{ width: 32 + 'px' }} data-tip data-for={"img" + indx} />
                        <ReactTooltip id={"img" + indx} place="top" border
                            textColor='#5F4B8BFF' backgroundColor='#E69A8DFF' borderColor='darkgreen' backgroundColor='white' borderColor='black' arrowColor='white'>
                            <img src={userMedals.uriList[indx]} style={{ width: 128 + 'px' }}
                            />
                        </ReactTooltip>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}
class MedalAthlete extends Component {
    render() {
        console.log(this.props.userProfile.userMedals)
        return (
            <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 col-align-items-center">

                <h6>{"Mes Médailles"}:</h6> <span> {this.props.userProfile.userMedals.nbMedals} {" Médaille(s)"} </span>
                <div className="tableFixHead-White  ">
                    <table className="table  bordered" >
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{"Fédération"}</th>
                                <th scope="col">{"Evénement"}</th>
                                <th scope="col">{"Gallerie"}</th>
                                <th scope="col">{"Image"}</th>
                            </tr>
                        </thead>
                        <TableMedalItems userMedals={this.props.userProfile.userMedals} web3={this.props.userProfile.web3} contract={this.props.AppCallBacks.getContract()} address={this.props.userProfile.address} AppCallBacks={this.props.AppCallBacks} />
                    </table>
                </div>
            </Container>

        )
    }
}

export default MedalAthlete