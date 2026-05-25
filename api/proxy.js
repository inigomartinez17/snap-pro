export const config = {
  runtime: 'edge', // Tecnología Serverless de Vercel para no tener límites de peso
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get('url');
  
  if (!videoUrl) {
    return new Response(JSON.stringify({ error: "Falta la URL del vídeo" }), { status: 400 });
  }

  try {
    // Simulamos ser un usuario real navegando desde Chrome
    const videoResponse = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (!videoResponse.ok) {
      return new Response("El servidor origen bloqueó el acceso al proxy.", { status: videoResponse.status });
    }

    // Retransmitimos el vídeo forzando la descarga como archivo MP4
    return new Response(videoResponse.body, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="SnapPro_Premium.mp4"',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response("Error crítico en el nodo Edge.", { status: 500 });
  }
}
