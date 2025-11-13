import { Usuario } from "./Usuario"

export class Dispositivo {
    idDispositivo: number = 0
    nombre: string = ""
    tipo: string = ""
    ubicacion : string = ""
    fechaRegistro : Date = new Date()
    usuario : Usuario = new Usuario() // relacion FK
}