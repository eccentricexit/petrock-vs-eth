import 'antd/dist/antd.css'
import { Typography, Card } from 'antd';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const { Title } = Typography

function App() {

  // Fees selected to get your tx confirmed in less than 20 minutes.
  const [btcFee, setBtcFee] = useState()
  useEffect(() => {
    ;(async () => {
      const { fastestFee } = await (await fetch('https://bitcoinfees.earn.com/api/v1/fees/recommended')).json()
      const { bitcoin: { usd }} = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')).json()
      const BTC_IN_SATOSHIS = 100000000
      const BTC_TRANSFER_BYTES = 250
      setBtcFee(fastestFee * BTC_TRANSFER_BYTES * usd/BTC_IN_SATOSHIS)
    })()
  }, [])

  const [ethFee, setEthFee] = useState()
  useEffect(() => {
    ;(async () => {
      const { data: { standard } } = await (await fetch('https://www.gasnow.org/api/v3/gas/price?utm_source=petrockvseth')).json()
      const { ethereum: { usd }} = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')).json()
      const ETH_IN_WEI = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18))
      const BASIC_TRANSFER_GAS = ethers.BigNumber.from(21000)
      setEthFee(
        ethers.BigNumber.from(standard)
          .mul(ethers.BigNumber.from(BASIC_TRANSFER_GAS))
          .mul(ethers.BigNumber.from(usd*100))
          .div(ethers.BigNumber.from(ETH_IN_WEI))
          .toNumber()/100
      )
    })()
  }, [])

  return (
    <div style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Title>It currently costs</Title>
        <div style={{ display: 'flex'}}>
          <Card
            title={<Title style={{textAlign: 'center'}} level={2}>{ethFee?.toFixed(2)} USD</Title>}
            bordered={false}
            style={{ width: 300, margin: '8px', alignItems: 'center' }}
            bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}
          >
            <img style={{ marginBottom: '12px'}} alt="coin-icon" src={"https://duckduckgo.com/i/5c54b131.png"} width={80}/>
            <p>to transfer ETH in about 3 minutes</p>
          </Card>
          <Card
            title={<Title style={{textAlign: 'center'}} level={2}>{btcFee?.toFixed(2)} USD</Title>}
            bordered={false}
            style={{ width: 300, margin: '8px', alignItems: 'center' }}
            bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}
          >
            <img style={{ marginBottom: '12px'}} alt="coin-icon" src={"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.kJ-eAj8z-ikVHiFwn58K_QHaHa%26pid%3DApi&f=1"} width={80}/>
            <p>to transfer BTC in about 20 minutes</p>
          </Card>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <h5>Sources</h5>
          <p>https://gasnow.org</p>
          <p>https://bitcoinfees.earn.com</p>
          <p>https://api.coingecko.com</p>
        </div>
    </div>
  );
}

export default App;
