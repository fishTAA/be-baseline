export interface station {
  name: string;
  id: number;
  geoLocation: [number, number];
  connections: [[number, number]];
}
export interface card {
  cardNum: number;
  Balance: number;
  state?: boolean;
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
