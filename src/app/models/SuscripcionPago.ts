import { MetodoPago } from "./MetodoPago"
import { Suscripcion } from "./Suscripcion"

export class Suscripcionpago{
    idSuscripcionPago: number = 0
    monto: number = 0
    fecha: Date = new Date()
    estado: string  = ""
    referenciaExterna: string = ""
    suscripcion: Suscripcion = new Suscripcion()
    metodoPago: MetodoPago  = new MetodoPago()
}