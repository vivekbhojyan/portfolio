module.exports = async (req, res) => {
    try {
        const response = await fetch("https://leetcode.com/graphql/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "https://leetcode.com",
                "Referer": "https://leetcode.com/",
                "User-Agent": "Mozilla/5.0"
            },
            body: JSON.stringify({
                operationName: "userProfileCalendar",
                query: `
                    query userProfileCalendar($username: String!) {
                        userProfileCalendar(username: $username) {
                            submissionCalendar
                        }
                    }
                `,
                variables: {
                    username: "vivekbhojyan"
                }
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(`LeetCode returned status ${response.status}`);
        }

        if (result.errors || !result.data?.userProfileCalendar?.submissionCalendar) {
            throw new Error("LeetCode did not return submission-calendar data.");
        }

        const calendar = JSON.parse(
            result.data.userProfileCalendar.submissionCalendar
        );

        res.setHeader(
            "Cache-Control",
            "s-maxage=3600, stale-while-revalidate=86400"
        );

        res.status(200).json({ calendar });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};