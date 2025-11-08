const BASE_URL = 'http://pruebas.somee.com/Vehiculo/' /*'https://localhost:7147/Vehiculo/'*/;

/*'https://localhost:7147/Vehiculo/'*/

export class ApiVehiculo {
  static async crearVehiculo(payload){
    // payload debe ser:
    // {
    //   idColor, idMarca, modelo, nombre,
    //   chasis, motor, activo
    // }
    const res = await fetch(`${BASE_URL}CrearVehiculo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Según la API, podría devolver 200/201 con JSON o texto
    const contentType = res.headers.get('Content-Type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();

    if(!res.ok){
      const msg = typeof data === 'string' ? data : JSON.stringify(data);
      throw new Error(`Error ${res.status}: ${msg}`);
    }
    return data;
  }
}
