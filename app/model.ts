export type Account = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  role: "admin" | "user";
};

export type Metric = "Temperature" | "Humidity" | "Light";

export type Row = {
  id: string;
  device?: string;
  sensor: Metric;
  value: string | number;
  date: string;
  ts: number;
};

export type HistoryDataItem = {
  id: string;
  timestamp: string;
  value: number;
  timestamp_local: string;
};