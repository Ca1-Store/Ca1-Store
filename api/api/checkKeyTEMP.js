export default async function handler(req, res) {
  const key = req.query.key;

  if (!key) {
    return res.status(400).send("no key provided");
  }

  try {
    // مثال بسيط بدون Firebase
    if (key === "12345") {
      return res.status(200).send("valid key");
    } else {
      return res.status(403).send("invalid key");
    }

  } catch (error) {
    return res.status(500).send(error.message);
  }
}
