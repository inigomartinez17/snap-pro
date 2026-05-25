export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.body;
    
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

    // Lógica Pro: Buscamos la mejor calidad y el thumbnail para la previsualización
    let result = {
        success: true,
        title: data.title || "Video Premium",
        thumbnail: data.thumbnail || data.picture || "",
        duration: data.duration || "",
        source: data.source || "social",
        links: []
    };

    if (data.medias) {
        result.links = data.medias.map(m => ({
            url: m.url || m.link,
            quality: m.quality || 'HD',
            extension: m.extension || 'mp4'
        }));
    } else if (data.url || data.link) {
        result.links.push({ url: data.url || data.link, quality: 'Default', extension: 'mp4' });
    }

    if (result.links.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(400).json({ success: false, error: "No se encontraron medios extraíbles." });
    }
    
  } catch (error) {
    res.status(500).json({ success: false, error: "Error de conexión con el nodo de extracción." });
  }
}
