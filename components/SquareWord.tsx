import { isEqual } from "lodash";
import React, { memo, useCallback, useEffect } from "react";
import { Share, Text, View, StyleSheet } from "react-native";
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedStyle,
	withDelay,
	withSequence,
	withTiming,
} from "react-native-reanimated";

interface ISquareWord {
	answer: { entered: boolean; word: string[]; check: string[] };
	currentCharIdx: number;
	flipWord: SharedValue<boolean>;
	popWord: SharedValue<number>;
	shakeWord: SharedValue<number>;
	waveWord: any;
	currentTries: boolean;
}

const SquareWord: React.FC<ISquareWord> = ({
	answer,
	currentCharIdx,
	flipWord,
	popWord,
	shakeWord,
	waveWord,
	currentTries,
}) => {
	const animatedPopStyles = useAnimatedStyle(() => ({
		transform: [{ scale: popWord.value }],
	}));
	const animatedShakeStyles = useAnimatedStyle(() => ({
		transform: [{ translateX: shakeWord.value }],
	}));

	const animatedWaveStyle = (delay: number, currentTries: boolean) => {
		return useAnimatedStyle(() => {
			if (!waveWord || !currentTries) return {};
			let translateVal = withDelay(
				delay,
				withSequence(
					withTiming(0, { duration: 0 }),
					withTiming(-27, { duration: 250 }),
					withTiming(0, { duration: 250 }),
				),
			);
			return { translateY: translateVal };
		});
	};
	const flipCardAnimatedStyle = (
		sharedValue: SharedValue<boolean>,
		delay: number,
		type: "regular" | "flipped",
	) => {
		return useAnimatedStyle(() => {
			const spinValue = interpolate(
				Number(sharedValue.value),
				[0, 1],
				type == "regular" ? [0, 180] : [180, 360],
			);
			const rotateValue = withDelay(
				delay,
				withTiming(`${spinValue}deg`, { duration: 700 }),
			);
			return {
				transform: [{ rotateX: rotateValue }],
			};
		});
	};
	return (
		<View className="flex-row gap-x-3  mb-5">
			<Animated.Text
				className={"hidden"}
				style={[animatedWaveStyle(5, true)]}></Animated.Text>
			{answer.word.map((char, idx) => (
				<View key={idx}>
					<Animated.View
						style={[
							idx == currentCharIdx - 1 && currentTries
								? animatedPopStyles
								: {},
							animatedWaveStyle(1 + (idx + 1) * 200, currentTries),
							currentTries ? animatedShakeStyles : {},
							flipCardStyles.regularCard,
							flipCardAnimatedStyle(flipWord, 50 + (idx + 1) * 200, "regular"),
						]}>
						<View
							className={`${
								char
									? "border-black dark:border-slate-300 "
									: "border-slate-500"
							}  h-16 w-16  border items-center justify-center`}>
							<Text className="font-bold text-5xl dark:text-white pt-2">
								{char}
							</Text>
						</View>
					</Animated.View>
					<Animated.View
						style={[
							animatedWaveStyle(1 + (idx + 1) * 200, currentTries),
							flipCardAnimatedStyle(flipWord, 50 + (idx + 1) * 200, "flipped"),
							flipCardStyles.flippedCard,
						]}>
						<View
							className={`h-16 w-16  border items-center justify-center ${
								answer.check[idx] == "correct"
									? "bg-green-700"
									: answer.check[idx] == "present"
									? "bg-amber-600"
									: answer.check[idx] == "absent"
									? "bg-neutral-700"
									: ""
							}`}>
							<Text className=" text-white  font-bold text-5xl  pt-2">
								{char}
							</Text>
						</View>
					</Animated.View>
				</View>
			))}
		</View>
	);
};

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

export default memo(SquareWord, (prevState, nextState) =>
	isEqual(prevState, nextState),
);
