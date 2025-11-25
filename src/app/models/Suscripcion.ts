import { PlanSuscripcion } from "./PlanSuscripcion";
import { Usuario } from "./Usuario";

export class Suscripcion {
    idSuscripcion: number = 0
    fechaInicio: Date = new Date();
    fechaFin: Date = new Date()
    estado: string = ""
    usuario: Usuario = new Usuario()
    planSuscripcion: PlanSuscripcion = new PlanSuscripcion()
}