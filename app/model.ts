export type Account = {
    email: string;
    password: string;
}

export type User = {
    id: number;
    email: string;
    role: "admin" | "user";
}

export type Metric = "Temperature" | "Humidity" | "Light" | "PIR";

export type Row = {
    id: string; 
    device: string; 
    sensor: Metric; 
    value: string | number; 
    date: string; 
    ts: number
}