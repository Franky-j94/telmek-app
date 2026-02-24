import { User } from "./user";

export interface SolicitudesEntity {
    id?: number;
    nombre_solicitante?: string;
    paterno_solicitante?: string;
    materno_solicitante?: string;
    fecha_solicitud?: string;
    activo?: boolean;
    user_id?: number;
    user?: User;
    created_at?: string;
    updated_at?: string;
}
