module.exports = async (req, res) => {
    const suppliedPassword = req.headers["x-analytics-password"];

    if (
        !process.env.ANALYTICS_PASSWORD ||
        suppliedPassword !== process.env.ANALYTICS_PASSWORD
    ) {
        return res.status(401).json({ error: "Incorrect password" });
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
        return res.status(500).json({ error: error.message ||error: "Could not load analytics" });
    }
};