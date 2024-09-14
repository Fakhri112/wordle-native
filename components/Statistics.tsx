import React, { memo, useEffect, useState } from "react";
import {
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	Text,
	Pressable,
} from "react-native";
import Animated, {
	FadeIn,
	FadeInDown,
	FadeOut,
	FadeOutDown,
} from "react-native-reanimated";
import { sleep } from "../lib/sleep";
import { statisticOperation } from "../lib/statisticData";
import BarChart from "./BarChart";

interface IStatistics {
	status: "home" | "afterGame";
	visible: boolean;
	transparent: boolean;
	dismiss: () => void;
	returnToHome?: () => void;
}

const Statistics: React.FC<IStatistics> = ({
	visible,
	transparent,
	dismiss,
	status,
	returnToHome,
}) => {
	const [modalChildren, SetModalChildren] = useState(false);
	useEffect(() => {
		if (visible) SetModalChildren(visible);
	}, [visible]);
	const closeModal = async () => {
		SetModalChildren(false);
		await sleep(100);
		dismiss();
	};

	return (
		<Modal
			visible={visible}
			transparent={transparent}
			onRequestClose={closeModal}>
			{modalChildren && (
				<>
					<TouchableWithoutFeedback onPress={closeModal}>
						<Animated.View
							entering={FadeIn}
							exiting={FadeOut}
							style={styles.modalOverlay}
						/>
					</TouchableWithoutFeedback>

					<Animated.View
						entering={FadeInDown}
						exiting={FadeOutDown}
						style={{
							marginVertical: status == "home" ? "30%" : "20%",
							alignItems: "center",
						}}>
						<View className="border border-white dark:border-slate-500 bg-white dark:bg-neutral-900 w-[85%] items-center rounded-md pb-5 pt-10 px-5">
							<View>
								<Text className="text-xl font-semibold tracking-widest dark:text-slate-100">
									STATISTIC
								</Text>
							</View>
							<View className="flex-row mt-3">
								<View className="items-center">
									<Text className="text-5xl dark:text-slate-100">
										{statisticOperation().played}
									</Text>
									<Text className="w-16 text-center dark:text-slate-100">
										Played
									</Text>
								</View>
								<View className="items-center">
									<Text className="text-5xl dark:text-slate-100">
										{Math.round(statisticOperation().winPercentage)}
									</Text>
									<Text className="w-16 text-center dark:text-slate-100">
										Win %
									</Text>
								</View>
								<View className="items-center">
									<Text className="text-5xl dark:text-slate-100">
										{statisticOperation().currentStreak}
									</Text>
									<Text className="w-16 text-center dark:text-slate-100">
										Current Streak
									</Text>
								</View>
								<View className="items-center">
									<Text className="text-5xl dark:text-slate-100">
										{statisticOperation().maxStreak}
									</Text>
									<Text className="w-16 text-center dark:text-slate-100">
										Max Streak
									</Text>
								</View>
							</View>
							<Text className="text-xl mb-4 mt-5 font-semibold tracking-widest dark:text-slate-100">
								GUESS DISTRIBUTION
							</Text>
							<View className="w-full">
								{statisticOperation().attemptPercentages.map(
									({ totalAttempts, percentage }, idx) => (
										<BarChart
											key={idx}
											totalAttempts={totalAttempts}
											percentage={percentage}
										/>
									),
								)}
							</View>
							{status == "afterGame" ? (
								<Pressable
									onPress={returnToHome}
									className="bg-green-600 mt-5 p-3 rounded-md">
									<Text className="font-bold text-white text-2xl">
										Back To Home
									</Text>
								</Pressable>
							) : (
								<></>
							)}
						</View>
					</Animated.View>
				</>
			)}
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
});

const flipCardStyles = StyleSheet.create({
	regularCard: {
		position: "absolute",
		zIndex: 1,
	},
	flippedCard: {
		backfaceVisibility: "hidden",
		zIndex: 9,
	},
});

export default memo(Statistics);
