export default async function handler(req, res) {
  // CORS para que no haya bloqueos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url } = req.body;
    
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
    const data = await response.json();

    // EL BUSCADOR DE ENLACES 1000% DEFINITIVO
    let finalUrl = null;
    
    if (data.links && data.links.length > 0) {
        finalUrl = data.links[0].link || data.links[0].url;
    } else if (data.medias && data.medias.length > 0) {
        finalUrl = data.medias[0].url || data.medias[0].link;
    } else if (data.url) {
        finalUrl = data.url;
    } else if (data.video) {
        finalUrl = data.video;
    } else if (data.hd) {
        finalUrl = data.hd;
    }

    if (finalUrl) {
        res.status(200).json({ success: true, downloadUrl: finalUrl, title: data.title || "SnapPro_Video_Premium" });
    } else {
        res.status(400).json({ success: false, error: "Formato súper privado o no soportado." });
    }
    
  } catch (error) {
    res.status(500).json({ success: false, error: "El servidor de origen está saturado." });
  }
}
