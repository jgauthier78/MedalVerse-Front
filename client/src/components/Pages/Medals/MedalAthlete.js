import React, { Component } from "react";
import { Card, Container } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import ThrowInContract from "../../../contracts/ThrowIn.json";
import MedalContract from "../../../contracts/NFTMedaille.json";
import { useEffect, useState } from 'react'

async function getNFTImage(web3, address) {
    /*let contract = await new web3.eth.Contract(ThrowInContract.abi, address);
    let medal = await contract.methods.getMedal.call()
    let nft = await new web3.eth.Contract(MedalContract.abi, medal);
    let img = await nft.methods.tokenURI.call()
    return img*/
    return ""
}

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
                        {(new Date(Number(medal.event.endDate) * 1000)).toString()}
                    </td>
                    <td colSpan="1" className="text-center" >
                        {medal.succes.isInWinnerGallery ?
                            <button type="button" onClick={() => setGallery(AppCallBacks, address, contract, indx, false, medal.succes)} className="btn btn-link"><i className="fa fa-check-square-o " aria-hidden="true"></i></button>
                            :
                            <button type="button" onClick={() => setGallery(AppCallBacks, address, contract, indx, true, medal.succes)} className="btn btn-link"><i className="fa fa-square-o" aria-hidden="true"></i></button>
                        }
                    </td>
                    <td colSpan="1">
                        <img src={getNFTImage(web3, medal.succes.throwIn)} />
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
                        <TableMedalItems userMedals={this.props.userProfile.userMedals} web3={this.props.userProfile.web3} contract={this.props.AppCallBacks.getContract()} address={this.props.userProfile.address} AppCallBacks={this.props.AppCallBacks} />
                    </table>

                </Card>
            </Container>

        )
    }
}

export default MedalAthlete