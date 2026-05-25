export default async function handler(req, res) {
  // Cabeceras de seguridad
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    
    // Llamada a tu cuenta de RapidAPI
    const response = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '9b68effdc0msh818d7fe0bf89f67p1cab83jsn1907304bff58',
        'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
      },
      body: JSON.stringify({ url: url })
    });

    const data = await response.json();

    if (data.message || (data.code && data.code !== 200 && data.code !== 0)) {
        return res.status(400).json({ success: false, error: data.message || "La API rechazó la solicitud." });
    }

    // Lógica de extracción de la mejor calidad
    let finalUrl = null;
    let title = data.title || "Video Premium";

    if (data.medias && Array.isArray(data.medias) && data.medias.length > 0) {
        const noWatermark = data.medias.find(m => m.type === 'video' && m.quality !== 'watermark');
        finalUrl = noWatermark ? (noWatermark.url || noWatermark.link) : (data.medias[0].url || data.medias[0].link);
    } else if (data.links && Array.isArray(data.links) && data.links.length > 0) {
        finalUrl = data.links[0].link || data.links[0].url;
    } else if (data.url) { finalUrl = data.url; }
    else if (data.video) { finalUrl = data.video; }
    else if (data.hd) { finalUrl = data.hd; }

    if (finalUrl) {
        res.status(200).json({ success: true, downloadUrl: finalUrl, title: title });
    } else {
        res.status(400).json({ success: false, error: "Formato de red social no compatible." });
    }
    
  } catch (error) {
    res.status(500).json({ success: false, error: "Error de servidor interno." });
  }
}
