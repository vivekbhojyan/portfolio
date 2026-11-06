module.exports = async (req, res) => {
    try {
        const currentYear = new Date().getUTCFullYear();

        const response = await fetch("https://leetcode.com/graphql/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            },
            body: JSON.stringify({
                operationName: "userProfileCalendar",
                query: `
                    query userProfileCalendar(
                        $username: String!,
                        $currentYear: Int,
                        $previousYear: Int
                    ) {
                        matchedUser(username: $username) {
                            currentYear: userCalendar(year: $currentYear) {
                                submissionCalendar
                            }
                            previousYear: userCalendar(year: $previousYear) {
                                submissionCalendar
                            }
                        }
                    }
                `,
                variables: {
                    username: "vivekbhojyan",
                    currentYear: currentYear,
                    previousYear: currentYear - 1
                }
            })
        });

        const result = await response.json();

        if (!response.ok || result.errors) {
            throw new Error(
                result.errors?.[0]?.message ||
                `LeetCode returned status ${response.status}`
            );
        }

        const user = result.data?.matchedUser;

        if (!user) {
            throw new Error("LeetCode user was not found.");
        }

        const currentCalendar = JSON.parse(
            user.currentYear?.submissionCalendar || "{}"
        );

        const previousCalendar = JSON.parse(
            user.previousYear?.submissionCalendar || "{}"
        );

        res.setHeader(
            "Cache-Control",
            "s-maxage=3600, stale-while-revalidate=86400"
        );

        res.status(200).json({
            calendar: {
                ...previousCalendar,
                ...currentCalendar
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};