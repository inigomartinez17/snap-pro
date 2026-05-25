export default async function handler(req, res) {
  const { url } = req.body;
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '9b68effdc0msh818d7fe0bf89f67p1cab83jsn1907304bff58',
      'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
    },
    body: new URLSearchParams({ url })
  };

  try {
    const response = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', options);
    const data = await response.json();
    res.status(200).json({ success: true, downloadUrl: data.links[0].link, title: data.title });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}
