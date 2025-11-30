import { Foro } from "./Foro"
import { Usuario } from "./Usuario"

export class Publicacion {
    idPublicacion: number = 0
    titulo: string = ""
    contenido: string = ""
    privacidad: string = ""
    fecha: Date = new Date()
    vistas: number = 0
    compartidos: number = 0
    foro: Foro = new Foro()
    usuario: Usuario = new Usuario()
}