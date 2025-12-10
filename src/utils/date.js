import { DateTime } from "luxon"; 

const ZONA = "America/Mexico_City";

export function toMx(date) {
    return DateTime.fromISO(date, { zone: ZONA });
}

export function obtenerFechaActualMx() {
    return DateTime.now().setZone(ZONA);
}
