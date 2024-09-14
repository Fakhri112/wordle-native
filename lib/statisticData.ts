import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();
export const statisticOperation = () => {
	let results = JSON.parse(storage.getString("user.statistic") as string) as (
		| number
		| boolean
	)[];
	const stats = {
		played: results.length,
		win: results.filter((r) => typeof r === "number").length,
		winPercentage: 0,
		currentStreak: 0,
		maxStreak: 0,
		attemptPercentages: [{ totalAttempts: 0, percentage: 0 }],
	};

	stats.winPercentage =
		stats.win == 0 && stats.played == 0 ? 0 : (stats.win / stats.played) * 100;

	let streak = 0;
	for (const result of results) {
		if (typeof result === "number") {
			streak++;
			stats.maxStreak = Math.max(stats.maxStreak, streak);
		} else streak = 0;
	}

	const attemptCounts: {
		[key: number]: number;
	} = {};
	const eliminateFalse = results.filter((result) => result);
	const totalGames = eliminateFalse.length;
	const maxAttempts = 6;

	eliminateFalse.forEach((result) => {
		if (typeof result === "number")
			attemptCounts[result] = (attemptCounts[result] || 0) + 1;
	});

	for (let i = 1; i <= 6; i++) {
		if (!attemptCounts.hasOwnProperty(i)) attemptCounts[i] = 0;
	}

	const attemptPercentages = Array.from({ length: maxAttempts }, (_, i) => ({
		totalAttempts: attemptCounts[i + 1],
		percentage: parseFloat(
			(((attemptCounts[i + 1] || 0) / totalGames) * 100).toFixed(2),
		),
	}));

	stats.currentStreak = streak;
	stats.attemptPercentages = attemptPercentages;
	return stats;
};
