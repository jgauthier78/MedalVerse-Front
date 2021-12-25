// Ceramic / IDX / 3ID/Connect
import CeramicClient from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { DID } from 'dids'

import { CERAMIC_ENDPOINT, BASIC_PROFILE_ALIAS } from './did_CONSTS'

var networkId, accountAddress, PROVIDER;

const DID_init = async ( web3, /*window.ethereum*/ provider ) =>
{
    console.log("DID_init")
    networkId = await web3.eth.net.getId();
    accountAddress = await web3.eth.getAccounts();
    PROVIDER = provider;
} // init


const DID_showConf = () =>
{
    console.log("DID_showConf : networkId = " + networkId + " accountAddress = " + accountAddress )
}

const DID_readProfile = async ( /*address, web3 */ /*, endpoint*/ ) =>
{
  console.log("DID_readProfile")
    //const [address] = await connect()
    const ceramic = new CeramicClient(/*endpoint*/CERAMIC_ENDPOINT)
    const idx = new IDX({ ceramic })

    try
    {
      const data = await idx.get
      (
        // 'basicProfile', // basic profile index alias
        BASIC_PROFILE_ALIAS, // index alias 
        //`${address}@eip155:1`
        didAddress()
      )
      console.log('data: ', data)
    //   if (data.name) setName(data.name)
    //   if (data.avatar) setImage(data.avatar)
      return data;
    } catch (error)
    {
      console.log('error: ', error)
//      setLoaded(true)
        return undefined;
    }
} // readProfile

const DID_updateProfile = async ( /*address, web3, *//* endpoint*/ data ) =>
{
//    const [address] = await connect()
    const ceramic = new CeramicClient(/*endpoint*/ CERAMIC_ENDPOINT )
    const threeIdConnect = new ThreeIdConnect()
    const provider = new EthereumAuthProvider( 
        PROVIDER, // Provider
         
         accountAddress // address
         )

    await threeIdConnect.connect(provider)

    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: {
        ...ThreeIdResolver.getResolver(ceramic)
      }
    })

    ceramic.setDID(did)
    await ceramic.did.authenticate()

    const idx = new IDX({ ceramic })

    await idx.set(
        //'basicProfile',
        BASIC_PROFILE_ALIAS, // index alias 
        data
    //  {
      
    //   name,
    //   avatar: image
    // }
    )

    console.log("Profile updated!")
} // updateProfile

const didAddress = () =>
{
    return `${accountAddress}@eip155:${networkId}`
}

export { DID_init, DID_readProfile, DID_updateProfile, DID_showConf };
// export default readProfile;