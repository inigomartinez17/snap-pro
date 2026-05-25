export default async function handler(req, res) {
  // Cabeceras de seguridad permisivas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: "No se envió ninguna URL." });
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '9b68effdc0msh818d7fe0bf89f67p1cab83jsn1907304bff58',
        'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
      },
      body: JSON.stringify({ url: url })
    };

    const response = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', options);
    
    // Obtenemos la respuesta cruda
    const data = await response.json();
    
    // Si la API dice que hay un error de su lado, lo devolvemos
    if (data.message || (data.code && data.code !== 200 && data.code !== 0)) {
        return res.status(400).json({ success: false, error: data.message || "Error interno de la API.", rawData: data });
    }

    // Devolvemos toda la información cruda al frontend para que el frontend decida
    res.status(200).json({ success: true, rawData: data });
    
  } catch (error) {
    res.status(500).json({ success: false, error: "El servidor Node falló: " + error.message });
  }
}
