import 'antd/dist/antd.css';
import './index.css';
import { Typography, Card } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';

const { Title, Paragraph, Text } = Typography;

function App() {
  // Fees selected to get your tx confirmed in less than 20 minutes.
  const [btcFee, setBtcFee] = useState();
  const fetchBtcFee = useCallback(async () => {
    const { fastestFee } = await (
      await fetch('https://bitcoinfees.earn.com/api/v1/fees/recommended')
    ).json();
    const {
      bitcoin: { usd },
    } = await (
      await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    ).json();
    const BTC_IN_SATOSHIS = 100000000;
    const BTC_TRANSFER_BYTES = 250;
    setBtcFee((fastestFee * BTC_TRANSFER_BYTES * usd) / BTC_IN_SATOSHIS);
  }, []);

  useEffect(() => {
    fetchBtcFee();
    setInterval(fetchBtcFee, 10 * 1000);
  }, [fetchBtcFee]);

  const [ethFee, setEthFee] = useState();
  const fetchEthFee = useCallback(async () => {
    const {
      data: { standard },
    } = await (
      await fetch('https://www.gasnow.org/api/v3/gas/price?utm_source=petrockvseth')
    ).json();
    const {
      ethereum: { usd },
    } = await (
      await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    ).json();
    const ETH_IN_WEI = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18));
    const BASIC_TRANSFER_GAS = ethers.BigNumber.from(21000);
    setEthFee(
      ethers.BigNumber.from(standard)
        .mul(ethers.BigNumber.from(BASIC_TRANSFER_GAS))
        .mul(ethers.BigNumber.from(usd * 100))
        .div(ethers.BigNumber.from(ETH_IN_WEI))
        .toNumber() / 100,
    );
  }, []);
  useEffect(() => {
    fetchEthFee();
    setInterval(fetchEthFee, 10 * 1000);
  }, [fetchEthFee]);

  return (
    <div
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: '32px 64px',
        textAlign: 'center',
      }}
    >
      <Title>It currently costs</Title>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '32px 0',
        }}
      >
        <Card
          bordered={false}
          title={<Title level={2}>{btcFee?.toFixed(2)} USD</Title>}
          style={{
            width: 300,
            margin: '24px',
            alignItems: 'center',
            boxShadow: '-.5rem -.5rem .9375rem #fff,.5rem .125rem .9375rem hsla(0,0%,69.4%,.6)',
            borderRadius: '1.3rem',
            backgroundColor: '#f2f2f2',
          }}
          bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <img
            style={{ marginBottom: '32px', marginTop: '-12px' }}
            alt="coin-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/1200px-BTC_Logo.svg.png"
            width={100}
          />
          <p style={{ margin: 0 }}>to transfer BTC in about 20 minutes</p>
        </Card>
        <Card
          bordered={false}
          title={<Title level={2}>{ethFee?.toFixed(2)} USD</Title>}
          style={{
            width: 300,
            margin: '24px',
            alignItems: 'center',
            boxShadow: '-.5rem -.5rem .9375rem #fff,.5rem .125rem .9375rem hsla(0,0%,69.4%,.6)',
            borderRadius: '1.3rem',
            backgroundColor: '#f2f2f2',
          }}
          bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <img
            style={{ marginBottom: '32px', marginTop: '-12px' }}
            alt="coin-icon"
            src="https://duckduckgo.com/i/5c54b131.png"
            width={100}
          />
          <p style={{ margin: 0 }}>to transfer ETH in about 3 minutes</p>
        </Card>
      </div>

      <Title level={3}>Surprising?</Title>
      <Paragraph style={{ maxWidth: '460px' }}>
        You may also want to see how much{' '}
        <a href="https://etherscan.io/chartsync/chaindefault">storage you need </a> to run a node
        that <Text strong>stores and executes all transactions starting from genesis.</Text>
      </Paragraph>
      <Paragraph style={{ maxWidth: '460px' }}>
        Or that time{' '}
        <a href="https://en.bitcoin.it/wiki/Value_overflow_incident">
          Bitcoin's immutability was broken{' '}
        </a>{' '}
        to delete 182 billion BTC someone created.
      </Paragraph>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          marginTop: '32px',
        }}
      >
        <h5>Sources</h5>
        <a href="https://gasnow.org">https://gasnow.org</a>
        <a href="https://bitcoinfees.earn.com">https://bitcoinfees.earn.com</a>
        <a href="https://api.coingecko.com">https://api.coingecko.com</a>
        <a href="https://github.com/mtsalenc/petrock-vs-eth">Source code (PRs welcome)</a>
      </div>
    </div>
  );
}

export default App;
