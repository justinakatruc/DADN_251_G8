import { Account, Row, User } from "../model";

export const mockAccounts: Account[] = [
    {
        email: "admin@gmail.com",
        password: "123"
    },
    {
        email: "user1@gmail.com",
        password: "123"
    },
    {
        email: "user2@gmail.com",
        password: "123"
    }
]

export const mockUsers: User[] = [
    {
        id: 1,
        email: "admin@gmail.com",
        role: "admin"
    },
    {
        id: 2,
        email: "user1@gmail.com",
        role: "user"
    },
    {
        id: 3,
        email: "user2@gmail.com",
        role: "user"
    }
]

export const mockDevices = [
    {
        id: 1,
        name: "Device A",
        ownerId: 1
    },
    {
        id: 2,
        name: "Device B",
        ownerId: 2
    },
    {
        id: 3,
        name: "Device C",
        ownerId: 3
    },
    {
        id: 4,
        name: "Device D",
        ownerId: 2
    },
    {
        id: 5,
        name: "Device E",
        ownerId: 3
    },
    {
        id: 6,
        name: "Device F",
        ownerId: 1
    }
]

export const baseData: Row[] = [
    { id: "1",  device: "Device A", sensor: "Temperature", value: 38, date: "2025-09-30T08:58:00", ts: Date.parse("2025-09-30T08:58:00") },
    { id: "2",  device: "Device A", sensor: "Humidity",    value: 35,   date: "2025-09-30T08:59:00", ts: Date.parse("2025-09-30T08:59:00") },
    { id: "3",  device: "Device A", sensor: "Light",       value: 200,  date: "2025-09-30T09:00:00", ts: Date.parse("2025-09-30T09:00:00") },
    { id: "4",  device: "Device A", sensor: "PIR",         value: "motion", date: "2025-09-30T09:01:00", ts: Date.parse("2025-09-30T09:01:00") },
    { id: "5",  device: "Device A", sensor: "Temperature", value: 30, date: "2025-10-01T07:45:00", ts: Date.parse("2025-10-01T07:45:00") },
    { id: "6",  device: "Device A", sensor: "Humidity",    value: 15,   date: "2025-10-01T07:46:00", ts: Date.parse("2025-10-01T07:46:00") },
    { id: "7",  device: "Device A", sensor: "Light",       value: 150,  date: "2025-10-01T07:47:00", ts: Date.parse("2025-10-01T07:47:00") },
    { id: "8",  device: "Device A", sensor: "PIR",         value: "no motion", date: "2025-10-01T07:48:00", ts: Date.parse("2025-10-01T07:48:00") },

    // === Device B ===
    { id: "9",  device: "Device B", sensor: "Temperature", value: 26.8, date: "2025-09-29T08:00:00", ts: Date.parse("2025-09-29T08:00:00") },
    { id: "10", device: "Device B", sensor: "Humidity",    value: 58,   date: "2025-09-29T08:01:00", ts: Date.parse("2025-09-29T08:01:00") },
    { id: "11", device: "Device B", sensor: "Light",       value: 320,  date: "2025-09-29T08:02:00", ts: Date.parse("2025-09-29T08:02:00") },
    { id: "12", device: "Device B", sensor: "PIR",         value: "motion", date: "2025-09-29T08:03:00", ts: Date.parse("2025-09-29T08:03:00") },
    { id: "13", device: "Device B", sensor: "Temperature", value: 27.1, date: "2025-10-02T12:00:00", ts: Date.parse("2025-10-02T12:00:00") },
    { id: "14", device: "Device B", sensor: "Humidity",    value: 60,   date: "2025-10-02T12:01:00", ts: Date.parse("2025-10-02T12:01:00") },
    { id: "15", device: "Device B", sensor: "Light",       value: 295,  date: "2025-10-02T12:02:00", ts: Date.parse("2025-10-02T12:02:00") },
    { id: "16", device: "Device B", sensor: "PIR",         value: "no motion", date: "2025-10-02T12:03:00", ts: Date.parse("2025-10-02T12:03:00") },

    // === Device C ===
    { id: "17", device: "Device C", sensor: "Temperature", value: 25.9, date: "2025-09-25T09:30:00", ts: Date.parse("2025-09-25T09:30:00") },
    { id: "18", device: "Device C", sensor: "Humidity",    value: 65,   date: "2025-09-25T09:31:00", ts: Date.parse("2025-09-25T09:31:00") },
    { id: "19", device: "Device C", sensor: "Light",       value: 280,  date: "2025-09-25T09:32:00", ts: Date.parse("2025-09-25T09:32:00") },
    { id: "20", device: "Device C", sensor: "PIR",         value: "motion", date: "2025-09-25T09:33:00", ts: Date.parse("2025-09-25T09:33:00") },
    { id: "21", device: "Device C", sensor: "Temperature", value: 26.3, date: "2025-09-26T10:10:00", ts: Date.parse("2025-09-26T10:10:00") },
    { id: "22", device: "Device C", sensor: "Humidity",    value: 62,   date: "2025-09-26T10:11:00", ts: Date.parse("2025-09-26T10:11:00") },
    { id: "23", device: "Device C", sensor: "Light",       value: 305,  date: "2025-09-26T10:12:00", ts: Date.parse("2025-09-26T10:12:00") },
    { id: "24", device: "Device C", sensor: "PIR",         value: "no motion", date: "2025-09-26T10:13:00", ts: Date.parse("2025-09-26T10:13:00") },

    // === Device D ===
    { id: "25", device: "Device D", sensor: "Temperature", value: 28.4, date: "2025-09-20T08:20:00", ts: Date.parse("2025-09-20T08:20:00") },
    { id: "26", device: "Device D", sensor: "Humidity",    value: 57,   date: "2025-09-20T08:21:00", ts: Date.parse("2025-09-20T08:21:00") },
    { id: "27", device: "Device D", sensor: "Light",       value: 330,  date: "2025-09-20T08:22:00", ts: Date.parse("2025-09-20T08:22:00") },
    { id: "28", device: "Device D", sensor: "PIR",         value: "motion", date: "2025-09-20T08:23:00", ts: Date.parse("2025-09-20T08:23:00") },
    { id: "29", device: "Device D", sensor: "Temperature", value: 29.1, date: "2025-10-03T14:00:00", ts: Date.parse("2025-10-03T14:00:00") },
    { id: "30", device: "Device D", sensor: "Humidity",    value: 59,   date: "2025-10-03T14:01:00", ts: Date.parse("2025-10-03T14:01:00") },
    { id: "31", device: "Device D", sensor: "Light",       value: 340,  date: "2025-10-03T14:02:00", ts: Date.parse("2025-10-03T14:02:00") },
    { id: "32", device: "Device D", sensor: "PIR",         value: "no motion", date: "2025-10-03T14:03:00", ts: Date.parse("2025-10-03T14:03:00") },

    // === Device E ===
    { id: "33", device: "Device E", sensor: "Temperature", value: 26.5, date: "2025-09-18T07:00:00", ts: Date.parse("2025-09-18T07:00:00") },
    { id: "34", device: "Device E", sensor: "Humidity",    value: 64,   date: "2025-09-18T07:01:00", ts: Date.parse("2025-09-18T07:01:00") },
    { id: "35", device: "Device E", sensor: "Light",       value: 275,  date: "2025-09-18T07:02:00", ts: Date.parse("2025-09-18T07:02:00") },
    { id: "36", device: "Device E", sensor: "PIR",         value: "motion", date: "2025-09-18T07:03:00", ts: Date.parse("2025-09-18T07:03:00") },
    { id: "37", device: "Device E", sensor: "Temperature", value: 27.0, date: "2025-09-19T07:00:00", ts: Date.parse("2025-09-19T07:00:00") },
    { id: "38", device: "Device E", sensor: "Humidity",    value: 66,   date: "2025-09-19T07:01:00", ts: Date.parse("2025-09-19T07:01:00") },
    { id: "39", device: "Device E", sensor: "Light",       value: 290,  date: "2025-09-19T07:02:00", ts: Date.parse("2025-09-19T07:02:00") },
    { id: "40", device: "Device E", sensor: "PIR",         value: "no motion", date: "2025-09-19T07:03:00", ts: Date.parse("2025-09-19T07:03:00") },

    // === Device F ===
    { id: "41", device: "Device F", sensor: "Temperature", value: 29.5, date: "2025-09-15T06:30:00", ts: Date.parse("2025-09-15T06:30:00") },
    { id: "42", device: "Device F", sensor: "Humidity",    value: 55,   date: "2025-09-15T06:31:00", ts: Date.parse("2025-09-15T06:31:00") },
    { id: "43", device: "Device F", sensor: "Light",       value: 350,  date: "2025-09-15T06:32:00", ts: Date.parse("2025-09-15T06:32:00") },
    { id: "44", device: "Device F", sensor: "PIR",         value: "motion", date: "2025-09-15T06:33:00", ts: Date.parse("2025-09-15T06:33:00") },
    { id: "45", device: "Device F", sensor: "Temperature", value: 30.0, date: "2025-10-04T15:00:00", ts: Date.parse("2025-10-04T15:00:00") },
    { id: "46", device: "Device F", sensor: "Humidity",    value: 58,   date: "2025-10-04T15:01:00", ts: Date.parse("2025-10-04T15:01:00") },
    { id: "47", device: "Device F", sensor: "Light",       value: 360,  date: "2025-10-04T15:02:00", ts: Date.parse("2025-10-04T15:02:00") },
    { id: "48", device: "Device F", sensor: "PIR",         value: "no motion", date: "2025-10-04T15:03:00", ts: Date.parse("2025-10-04T15:03:00") },
]