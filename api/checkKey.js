export default function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const key = url.searchParams.get("key");

    if (!key) {
      return res.status(400).send("no key provided");
    }

    if (key === "12345") {
      return res.status(200).send("valid key");
    }

    return res.status(403).send("invalid key");

  } catch (error) {
    return res.status(500).send("server error: " + error.message);
  }
}
