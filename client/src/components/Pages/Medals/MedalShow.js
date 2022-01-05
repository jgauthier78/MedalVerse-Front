import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { useEffect, useState } from 'react'
import { Card, Col, Container } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { format_Date } from "../../../utils/dateUtils";
import { Table } from "react-bootstrap";


const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const GenerateMedalList = ({ lst }) => {

    if (lst == null || lst.winnersString.length == 0) return (<tr><td></td></tr>)

    return lst.winnersString.map((elm, indx) =>
    (
        <tr key="indx"><td><b>{lst.yearsOfVictory[indx]}</b></td>
            <td>{lst.winnersString[indx]}</td>
        </tr>
    )
    )

}


function AnimStack({ usrProfile, setString }) {
    const desc = [usrProfile.userMedals.Medals.length + 1]
    const nfDesc = [usrProfile.userMedals.Medals.length + 1]
    const [refresh, setRefresh] = useState(usrProfile.userMedals.Medals.length - 1)
    const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
    const [props, set] = useSprings(usrProfile.userMedals.uriList.length, i => ({ ...to(i), from: from(i) }))
    const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
        const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
        const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
        if (!down && trigger) {
            gone.add(index)
            setRefresh(gone.size)
        }
        set(i => {
            if (index !== i) return // We're only interested in changing spring-data for the current spring
            const isGone = gone.has(index)
            const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
            const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
            const scale = down ? 1.1 : 1 // Active cards lift up a bit
            return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
        })
        if (!down && gone.size === props.length) setTimeout(() => { setRefresh(0); return gone.clear() || set(i => to(i)) }, 600)
    })

    for (let u = 0; u < usrProfile.userMedals.Medals.length; u++) {
        desc[u] = (u + 1) + " " + usrProfile.userMedals.Medals[u].org + " " + format_Date(usrProfile.userMedals.Medals[u].event.endDate) + " - " + usrProfile.userMedals.Medals[u].event.eventDescription
        nfDesc[u] = usrProfile.userMedals.nftDesc[u]
    }
    desc[usrProfile.userMedals.Medals.length] = "-"
    nfDesc[usrProfile.userMedals.Medals.length] = null
    return (
        <div>
            {nfDesc[refresh] != null ?
                <Table >
                    <tbody>
                        <tr>
                            <td><b>Nom:</b></td>
                            <td>{nfDesc[refresh].name}</td>
                        </tr>
                        <tr>
                            <td><b>Symbole:</b></td>
                            <td>{nfDesc[refresh].symbol}</td>
                        </tr>
                        <tr><td><b>Org:</b></td>
                            <td>{nfDesc[refresh].orgName}</td>
                        </tr>
                        {
                            nfDesc[refresh].winnersString.length > 0 ?
                                <GenerateMedalList lst={nfDesc[refresh]} /> :
                                <tr><td>--</td>
                                    <td>Pas de gagnant </td>
                                </tr>
                        }

                    </tbody>
                </Table>
                : <></>
            }
            <div className="MedalShow-Desc-Container noselect">
                <div className="MedalShow-Desc">

                    <p className="noselect">{desc[refresh]}</p>
                </div>
            </div>
            <div className="MedalShow-PlayField">
                {props.map(({ x, y, rot, scale }, i) => {

                    return (

                        <animated.div className="MedalShow-Container" key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>

                            <animated.div className="MedalShow-Stack" {...bind(i)} style={{ transform: interpolate([rot, scale], trans), backgroundImage: `url(${usrProfile.userMedals.uriList[i]})` }} />
                        </animated.div>
                    )
                })}
            </div>
        </div>)
}

let MedalShow = ({ userProfile }) => {

    return (
        <Container className="col-md-9 col-lg-8 col-xl-8 mt-6">
            <Card >
                <CardHeader>Liste des Médailles</CardHeader>

                <AnimStack usrProfile={userProfile} />

            </Card>
        </Container >
    )
}

export default MedalShow