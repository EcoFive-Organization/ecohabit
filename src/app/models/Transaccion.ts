import { Billetera } from "./Billetera";

export class Transaccion{
    idTransaccion: number = 0;
    billetera: Billetera = new Billetera();
    tipo: string ='';
    montoPuntos: number = 0;
    fecha: Date = new Date();
    montoDineroReal: number = 0
    emailDestino: String = ""
    referenciaPaypal: String = ""
}