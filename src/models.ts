export interface station {
  _id: string;
  name: string;
  id: number;
  geoLocation: [number, number];
  connections: [string];
}
export interface card {
  _id: string
  cardNum: number;
  Balance: number;
  state?: boolean;
  device?: string;
}
export interface user {
  userName: string;
  password: string;
  lastName: string;
  firstName: string;
  email: string;
}
export interface Setting {
  Fare: number;
  Balance: number;
  Km: number;
  Title: string;
}
export interface TapTransaction {
  card: card;
  station: station;
  tapInTime: Date;
  tapOutTime?: Date;
}