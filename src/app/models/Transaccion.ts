import { Billetera } from "./Billetera";

export class Transaccion{
    idTransaccion: number = 0;
    billetera: Billetera = new Billetera();
    tipo: string ='';
    monto: number = 0;
    fecha: Date = new Date();
}