module.exports = async (req, res) => {
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
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

        if (!response.ok || result.errors || !result.data?.userProfileCalendar) {
            throw new Error("Unable to retrieve LeetCode activity.");
        }

        const calendar = JSON.parse(
            result.data.userProfileCalendar.submissionCalendar
        );

        res.status(200).json({ calendar });
    } catch (error) {
        res.status(500).json({
            error: "LeetCode activity could not be loaded."
        });
    }
};