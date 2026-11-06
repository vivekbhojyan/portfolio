module.exports = async (req, res) => {
    const authorization = req.headers.authorization || "";
    const expected = Buffer.from(
        `vivek:${process.env.ANALYTICS_PASSWORD}`
    ).toString("base64");

    if (authorization !== `Basic ${expected}`) {
        res.setHeader(
            "WWW-Authenticate",
            'Basic realm="Portfolio Analytics", charset="UTF-8"'
        );

        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const response = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/link_clicks?select=link_key,label,clicks,updated_at&order=clicks.desc`,
            {
                headers: {
                    apikey: process.env.SUPABASE_SECRET_KEY,
                    Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Could not load analytics" });
    }
};