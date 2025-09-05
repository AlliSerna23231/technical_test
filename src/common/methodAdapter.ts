export class MethodAdapter {
  static getCurrentUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  // Devuelve la fecha formateada (YYYY-MM-DD) según la fecha proporcionada
  static getScheduledDate(scheduledDate: string): string {
    const date = new Date(scheduledDate);
    if (isNaN(date.getTime())) {
      throw new Error('Fecha proporcionada no es válida');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Devuelve la hora actual en formato HH:mm:ss
  static getScheduledTime(scheduledTime?: string): string {
    if (!scheduledTime) {
      return "00:00:00"; 
    }

    const timeParts = scheduledTime.split(':');
    if (timeParts.length !== 3 || timeParts.some(part => isNaN(Number(part)))) {
      throw new Error('Hora proporcionada no es válida');
    }

    const [hours, minutes, seconds] = timeParts.map(Number);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }


}
