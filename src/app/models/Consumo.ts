import { Dispositivo } from "./Dispositivo";

export class Consumo {
    idConsumo: number = 0
    dispositivo: Dispositivo = new Dispositivo(); //Fk con Dispositivo
    tipo: string = ""
    valor: number = 0
    unidad: string = ""
    origenConsumo: string = ""
    fecha: Date = new Date();
    umbral: number = 0
}