"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { ThroughputDataPoint } from "@/lib/types";

interface CustomTooltipPayload {
  name?: string;
  value?: number | string;
  color?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border bg-background p-3 text-xs shadow-sm">
      <p className="font-semibold mb-1.5 text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <span
            className="inline-block w-2 h-2 rounded-sm shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}:</span>
          <span className="font-mono font-medium text-foreground">
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

interface ThroughputChartProps {
  data: ThroughputDataPoint[];
}

export function ThroughputChart({ data }: ThroughputChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-1)"
              stopOpacity={0.22}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-1)"
              stopOpacity={0.02}
            />
          </linearGradient>
          <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-2)"
              stopOpacity={0.20}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-2)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.6}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
          width={38}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="square"
          iconSize={8}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="messages"
          name="Messages Processed"
          stroke="var(--chart-1)"
          strokeWidth={1.5}
          fill="url(#fillMessages)"
          dot={false}
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="errors"
          name="Parse Errors"
          stroke="var(--chart-2)"
          strokeWidth={1.5}
          fill="url(#fillErrors)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
