import {
  Route,
  useLocation,
  useParams,
  Link,
  useMatch,
} from "react-router-dom";
import { useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "./../theme";
import { Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinTickers, fetchCoinInfo } from "./../api";
import { Helmet } from "react-helmet";

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  position: absolute;
`;

const Back = styled.span`
  position: relative;
  left: 500px;
  padding: 10px 25px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  :hover {
    color: ${(props) => props.theme.accentColor};
    padding: 15px 30px;
  }
  a {
    display: block;
  }
`;

const Loader = styled.span`
  text-align: center;
  font-size: 28px;
  padding: 20px;
  display: block;
`;

const OverView = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
`;

const OverViewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  span:first-child {
    font-size: 20px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  :hover {
    font-size: 30px;
    color: ${(props) => props.theme.accentColor};
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 30px 0px;
`;
const Tab = styled.span<{ isActive: boolean }>`
  padding: 7px 0px;
  text-align: center;
  border-radius: 10px;
  margin-right: 10px;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: ${(props) => (props.isActive ? "#A760FF" : props.theme.textColor)};
  background-color: rgba(0, 0, 0, 0.5);
  a {
    display: block;
  }
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

interface ChartProps {}

function Coin() {
  // const [loading, setLoading] = useState(true);
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  // const [info, setInfo] = useState<infoData>({});
  // const [priceInfo, setPriceInfo] = useState<priceData>({});
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const { isLoding: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );

  const { isLoding: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );

  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state?.name : loading ? "Loding..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state?.name : loading ? "Loding..." : infoData?.name}
        </Title>
        <Back>
          <Link to={`/`}>Back</Link>
        </Back>
      </Header>
      {loading ? (
        <Loader>...loading</Loader>
      ) : (
        <>
          <OverView>
            <OverViewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverViewItem>
            <OverViewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverViewItem>
            <OverViewItem>
              <span>name:</span>
              <span>{infoData?.name}</span>
            </OverViewItem>
          </OverView>
          <Description>{infoData?.description}</Description>
          <OverView>
            <OverViewItem>
              <span>Total Suply::</span>
              <span>{tickersData?.total_supply}</span>
            </OverViewItem>
            <OverViewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverViewItem>
          </OverView>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Outlet context={{ coinId }} />
        </>
      )}
    </Container>
  );
}

export default Coin;
