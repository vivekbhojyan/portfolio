module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { key, label } = req.body || {};

        if (
            typeof key !== "string" ||
            typeof label !== "string" ||
            !/^[a-z0-9:-]{1,120}$/.test(key) ||
            label.length < 1 ||
            label.length > 120
        ) {
            return res.status(400).json({ error: "Invalid tracking data" });
        }

        const response = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/rpc/increment_link_click`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: process.env.SUPABASE_SECRET_KEY,
                    Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`
                },
                body: JSON.stringify({
                    p_key: key,
                    p_label: label
                })
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({ error: "Could not record click" });
    }
};