export interface station{
    name: string;
    id: number;
    geoLocation:[number,number]
  }
export interface card{
    cardNum: number;
    Balance: number;
    state?:boolean;
}
export interface user{
    userName:string;
    password:string;
    lastName:string;
    firstName:string;
    email:string;

}