import React, { useCallback, useMemo, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableWithoutFeedback,
} from "react-native";
import { wordsList } from "../lib/5wordList";
import { useColorScheme } from "nativewind";
import {
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import HowToPlay from "../components/HowToPlay";
import Toaster from "../components/Toaster";
import { CHAR, ANSWER_INITIAL } from "../lib/initialState";
import SquareWords from "../components/SquareWords";
import { wordleAlgorithm } from "../lib/wordleAlgo";
import Keyboard from "../components/Keyboard";
import Statistics from "../components/Statistics";
import { sleep } from "../lib/sleep";
import { storage } from "../lib/statisticData";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./";
import { useFocusEffect } from "expo-router";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;
type TAnswer = {
	id: number;
	entered: boolean;
	word: string[];
	check: string[];
}[];
interface ICharacterStatusResult {
	[key: string]: string;
}

const Game = ({ route, navigation }: Props) => {
	const { colorScheme, toggleColorScheme } = useColorScheme();
	const selectedWord = useMemo(
		() => wordsList[Math.floor(Math.random() * wordsList.length)],
		[],
	);
	const [currentTries, SetCurrentTries] = useState(0);
	const [answer, SetAnswer] = useState<TAnswer>(ANSWER_INITIAL);
	const [characterStatusResult, SetCharacterStatusResult] =
		useState<ICharacterStatusResult>({});
	const [currentCharIdx, SetCurrentCharIdx] = useState(0);
	const [openHowToPlay, SetOpenHowToPlay] = useState(false);
	const [openStatistic, SetOpenStatistic] = useState(false);
	const [isFinish, SetIsFinish] = useState(false);
	const [msgInfoModal, SetMsgInfoModal] = useState("");
	const popWord = useSharedValue(1);
	const shakeWord = useSharedValue(0);
	const [waveWord, SetWaveWord] = useState(false);
	const flipWord = [
		useSharedValue(false),
		useSharedValue(false),
		useSharedValue(false),
		useSharedValue(false),
		useSharedValue(false),
		useSharedValue(false),
	];

	useFocusEffect(
		useCallback(() => {
			return () => {
				SetAnswer([...ANSWER_INITIAL]);
				SetCharacterStatusResult({});
				SetCurrentCharIdx(0);
				SetCurrentTries(0);
				SetOpenHowToPlay(false);
				SetOpenStatistic(false);
				SetWaveWord(false);
				SetIsFinish(false);
				SetMsgInfoModal("");
			};
		}, []),
	);

	useFocusEffect(
		useCallback(() => {
			if (colorScheme) storage.set("color.scheme", colorScheme);
		}, [colorScheme]),
	);

	const handlePressKey = async (key: string) => {
		let copyAnswer = JSON.parse(JSON.stringify(answer));
		let copyCharacterStatusResult = JSON.parse(
			JSON.stringify(characterStatusResult),
		) as ICharacterStatusResult;
		let position = copyAnswer[currentTries].word.findIndex(
			(el: string) => el == "",
		);

		if (key == "⌫") {
			if (position == -1) position = 5;
			copyAnswer[currentTries].word[position - 1] = "";
			if (currentCharIdx > 0) SetCurrentCharIdx(position - 1);
		} else if (key == "ENTER") {
			if (position != -1) return triggerToaster("Not Enough Letter", "shake");
			if (
				!wordsList.includes(
					copyAnswer[currentTries].word.join("").toLowerCase(),
				)
			)
				return triggerToaster("Not in word list", "shake");
			else {
				copyAnswer[currentTries].entered = true;
				let processWord = wordleAlgorithm(
					copyAnswer[currentTries].word.join("").toLowerCase(),
					selectedWord,
				);
				copyAnswer[currentTries].check = processWord.statuses;
				for (const key in processWord.charStatus) {
					if (
						copyCharacterStatusResult[key] === "present" &&
						processWord.charStatus[key] === "correct"
					)
						copyCharacterStatusResult[key] = "correct";
					else if (!copyCharacterStatusResult.hasOwnProperty(key))
						copyCharacterStatusResult[key] = processWord.charStatus[key];
				}
				SetAnswer([...copyAnswer]);
				let checkIfAllCorrect = processWord.statuses.every(
					(element) => element == "correct",
				);
				SetCurrentCharIdx(0);
				flipWord[currentTries].value = !flipWord[currentTries].value;
				await sleep(100);
				SetCharacterStatusResult({ ...copyCharacterStatusResult });
				if (checkIfAllCorrect) return triggerToaster("Great", "wave");
				if (!checkIfAllCorrect && currentTries == 5)
					return triggerToaster(selectedWord.toUpperCase(), "none");
				return SetCurrentTries((prev) => prev + 1);
			}
		} else {
			copyAnswer[currentTries].word[position] = key;
			popWord.value = withRepeat(withTiming(0.6, { duration: 70 }), 2, true);
			if (currentCharIdx < 5) SetCurrentCharIdx(position + 1);
		}

		SetAnswer([...copyAnswer]);
	};

	const triggerToaster = async (
		msg: string,
		animation: "shake" | "wave" | "none",
	) => {
		let getResultData = JSON.parse(
			storage.getString("user.statistic") as string,
		) as (number | boolean)[];

		if (animation == "shake") {
			shakeWord.value = withSequence(
				withTiming(-10, { duration: 70 / 2 }),
				withRepeat(withTiming(10, { duration: 70 }), 5, true),
				withTiming(0, { duration: 70 / 2 }),
			);
		}

		if (animation == "wave") {
			SetWaveWord(true);
			getResultData.push(currentTries + 1);
			storage.set("user.statistic", JSON.stringify(getResultData));
		}
		if (animation == "none") {
			getResultData.push(false);
			storage.set("user.statistic", JSON.stringify(getResultData));
		}

		SetMsgInfoModal(msg);
		await sleep(2200);
		SetMsgInfoModal("");
		SetWaveWord(false);
		if (["none", "wave"].includes(animation)) {
			SetIsFinish(true);
			SetOpenStatistic(true);
		}
	};

	return (
		<View className="flex-1 dark:bg-neutral-900">
			<Toaster msg={msgInfoModal} />
			<Statistics
				status={"afterGame"}
				visible={openStatistic}
				transparent={true}
				dismiss={() => SetOpenStatistic(false)}
				returnToHome={() => navigation.navigate("Home")}
			/>
			<HowToPlay
				visible={openHowToPlay}
				transparent={true}
				dismiss={() => SetOpenHowToPlay(false)}
			/>
			<TouchableWithoutFeedback onPress={() => SetOpenStatistic(true)}>
				<View
					className={`${
						isFinish && !openStatistic ? "z-20" : "hidden"
					} absolute bg-transparent h-full w-full`}
				/>
			</TouchableWithoutFeedback>
			<View className="justify-between flex-row px-5 mt-3 items-center">
				<Pressable onPress={() => SetOpenHowToPlay(true)}>
					<AntDesign
						className="bg-white border-white border"
						name="questioncircleo"
						style={{
							color: colorScheme == "light" ? "black" : "rgb(148 163 184);",
						}}
						size={28}
					/>
				</Pressable>
				<Text className="font-bold text-4xl dark:text-slate-100">Wordle</Text>
				<Pressable onPress={toggleColorScheme} className="">
					{colorScheme == "light" ? (
						<Ionicons
							style={{
								color: "black",
							}}
							name="moon-sharp"
							size={28}
						/>
					) : (
						<Ionicons
							name="sunny"
							size={28}
							style={{
								color: "rgb(148 163 184);",
							}}
						/>
					)}
				</Pressable>
			</View>
			<View
				className="my-2 dark:border-blue-900"
				style={{
					borderBottomWidth: StyleSheet.hairlineWidth,
				}}></View>
			<View className="flex-1 justify-between">
				<View className="items-center mt-5 mb-3">
					{answer.map((data, idx) => (
						<SquareWords
							key={data.id}
							answer={data}
							currentTries={currentTries == idx}
							currentCharIdx={currentTries == idx ? currentCharIdx : 0}
							flipWord={flipWord[idx]}
							popWord={popWord}
							shakeWord={shakeWord}
							waveWord={waveWord}
						/>
					))}
				</View>
				<Keyboard
					characterStatusResult={characterStatusResult}
					handlePressKey={handlePressKey}
					CHAR={CHAR}
				/>
			</View>
		</View>
	);
};

export default Game;
