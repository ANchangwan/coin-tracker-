import { useQuery } from "react-query";
import { useParams, useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "./../api";
import styled from "styled-components";
import ApexChart from "react-apexcharts";

interface PriceProps {
  coinId: string;
}
interface IHistorycal {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
  map: any;
}
const ShowPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-bottom: 15px;
`;
function Price() {
  const { coinId } = useOutletContext<PriceProps>();
  const { isLoading, data } = useQuery<IHistorycal>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  console.log(
    data?.map((item) => ({
      x: item.time_open,
      y: [item.high, item.open, item.low, item.close],
    }))
  );
  return (
    <ApexChart
      type="candlestick"
      series={[
        {
          data: data?.map((item) => ({
            x: item.time_open,
            y: [item.high, item.open, item.low, item.close],
          })),
        },
      ]}
      options={{
        chart: {
          type: "candlestick",
          height: 350,
        },
        colors: ["#0fbcf9"],
        title: {
          text: "CandleStick Chart",
          align: "left",
        },
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
      }}
    />
  );
}

export default Price;
