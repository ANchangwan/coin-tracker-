import { useQuery } from "react-query";
import { useParams, useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { Helmet } from "react-helmet";
import { isDarkAtom } from "./atoms";
import { useRecoilValue } from "recoil";

interface ChartProps {
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
}

function Chart() {
  const isDark = useRecoilValue(isDarkAtom);
  const { coinId } = useOutletContext<ChartProps>();
  const { isLoading, data } = useQuery<IHistorycal[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 5000,
    }
  );
  console.log(data);
  return (
    <div>
      {isLoading ? (
        "Loading Chart..."
      ) : (
        <ApexChart
          type="line"
          series={[{ name: "Price", data: data?.map((price) => price.close) }]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              toolbar: {
                show: false,
              },
              background: "transparent",
              height: 300,
              width: 500,
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: "smooth",
              width: 5,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              labels: { show: false },
              axisTicks: { show: false },
              axisBorder: { show: false },
              type: "datetime",
              categories: data?.map((price) => price.time_close),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: {
                formatter: (value) => `${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
