import React, { memo, useEffect, useState } from "react";
import {
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	Text,
} from "react-native";
import Animated, {
	FadeIn,
	FadeInDown,
	FadeOut,
	FadeOutDown,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface IHowToPlayModal {
	visible: boolean;
	transparent: boolean;
	dismiss: () => void;
}

const HowToPlay: React.FC<IHowToPlayModal> = ({
	visible,
	transparent,
	dismiss,
}) => {
	const [modalChildren, SetModalChildren] = useState(false);
	const flipped = useSharedValue(false);

	const regularCardAnimatedStyle = useAnimatedStyle(() => {
		const spinValue = interpolate(Number(flipped.value), [0, 1], [0, 180]);
		const rotateValue = withTiming(`${spinValue}deg`, { duration: 700 });

		return {
			transform: [{ rotateX: rotateValue }],
		};
	});

	const flippedCardAnimatedStyle = useAnimatedStyle(() => {
		const spinValue = interpolate(Number(flipped.value), [0, 1], [180, 360]);
		const rotateValue = withTiming(`${spinValue}deg`, { duration: 700 });

		return {
			transform: [{ rotateX: rotateValue }],
		};
	});

	useEffect(() => {
		if (visible) {
			SetModalChildren(visible);
			flipped.value = true;
		}
	}, [visible]);

	const closeModal = () => {
		SetModalChildren(false);
		setTimeout(() => {
			dismiss();
			flipped.value = false;
		}, 100);
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
							...styles.modalContent,
						}}>
						<View className="border border-white dark:border-slate-500 bg-white dark:bg-neutral-900 w-[89%] items-center rounded-md py-2">
							<Text className="font-semibold dark:text-slate-100 text-xl">
								How To Play
							</Text>
						</View>
						<View className="border border-white dark:border-slate-500 mt-2 p-2 w-[89%]  bg-white dark:bg-neutral-900 rounded-md">
							<Text className="dark:text-slate-100">
								Guess the hidden word in 6 tries.
							</Text>
							<Text className="dark:text-slate-100 mt-2 text-justify">
								Each guess must be a valid 5 letter word, you cannot enter
								random letters. Hit the enter button to submit the guess.
							</Text>
							<Text className="dark:text-slate-100 mt-2 text-justify">
								After your submission, the color of the tiles will change as in
								the examples below.
							</Text>
							<View
								className="my-2 dark:border-blue-100"
								style={{
									borderBottomWidth: StyleSheet.hairlineWidth,
								}}></View>
							<Text className="dark:text-slate-100 font-semibold">
								Examples
							</Text>
							<View className="flex-row gap-2 mt-2">
								<View>
									<Animated.View
										style={[
											regularCardAnimatedStyle,
											flipCardStyles.regularCard,
										]}>
										<View>
											<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
												G
											</Text>
										</View>
									</Animated.View>
									<Animated.View
										style={[
											flippedCardAnimatedStyle,
											flipCardStyles.flippedCard,
										]}>
										<View className="bg-green-700">
											<Text className="text-white py-2 font-bold text-xl px-4 border">
												G
											</Text>
										</View>
									</Animated.View>
								</View>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									A
								</Text>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									M
								</Text>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									E
								</Text>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									S
								</Text>
							</View>
							<Text className="mt-2 dark:text-slate-100">
								The Letter <Text className="font-bold">G</Text> is in the word
								and in the correct spot.
							</Text>
							<View className="flex-row gap-2 mt-2 ">
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									H
								</Text>
								<View>
									<Animated.View
										style={[
											regularCardAnimatedStyle,
											flipCardStyles.regularCard,
										]}>
										<View>
											<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
												O
											</Text>
										</View>
									</Animated.View>
									<Animated.View
										style={[
											flippedCardAnimatedStyle,
											flipCardStyles.flippedCard,
										]}>
										<View className="bg-amber-600">
											<Text className="text-white py-2 font-bold text-xl px-4 border">
												O
											</Text>
										</View>
									</Animated.View>
								</View>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									T
								</Text>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									E
								</Text>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									L
								</Text>
							</View>
							<Text className="mt-2 dark:text-slate-100">
								The Letter <Text className="font-bold">O</Text> is in the word
								but in the wrong spot.
							</Text>
							<View className="flex-row gap-2 mt-2">
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									C
								</Text>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									L
								</Text>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									I
								</Text>
								<View>
									<Animated.View
										style={[
											regularCardAnimatedStyle,
											flipCardStyles.regularCard,
										]}>
										<View>
											<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
												C
											</Text>
										</View>
									</Animated.View>
									<Animated.View
										style={[
											flippedCardAnimatedStyle,
											flipCardStyles.flippedCard,
										]}>
										<View className="bg-neutral-700">
											<Text className="text-white py-2 font-bold text-xl px-4 border">
												C
											</Text>
										</View>
									</Animated.View>
								</View>
								<Text className="dark:text-slate-100 py-2 font-bold text-xl px-4 border dark:border-slate-500">
									K
								</Text>
							</View>
							<Text className="dark:text-slate-100 mt-2">
								The Letter <Text className="font-bold">C</Text> is not in the
								word in any spot.
							</Text>
						</View>
					</Animated.View>
				</>
			)}
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContent: {
		marginVertical: "25%",
		alignItems: "center",
	},
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

export default memo(HowToPlay);
