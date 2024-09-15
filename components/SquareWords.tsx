import { isEqual } from "lodash";
import React, { memo, useCallback, useEffect } from "react";
import { View } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import Square from "./Square";

interface ISquareWords {
	answer: { entered: boolean; word: string[]; check: string[] };
	currentCharIdx: number;
	flipWord: SharedValue<boolean>;
	popWord: SharedValue<number>;
	shakeWord: SharedValue<number>;
	waveWord: any;
	currentTries: boolean;
}

const SquareWords: React.FC<ISquareWords> = ({
	answer,
	currentCharIdx,
	flipWord,
	popWord,
	shakeWord,
	waveWord,
	currentTries,
}) => {
	return (
		<View className="flex-row gap-x-3  mb-5">
			{answer.word.map((char, idx) => (
				<View key={idx}>
					<Square
						char={char}
						idx={idx}
						currentCharIdx={currentCharIdx}
						currentTries={currentTries}
						answer={answer}
						popWord={popWord}
						shakeWord={shakeWord}
						waveWord={waveWord}
						flipWord={flipWord}
					/>
				</View>
			))}
		</View>
	);
};

export default memo(SquareWords, (prevState, nextState) =>
	isEqual(prevState, nextState),
);
