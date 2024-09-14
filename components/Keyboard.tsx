import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface IKeyboard {
	CHAR: string[][];
	handlePressKey: (type: string) => void;
	characterStatusResult: { [key: string]: string };
}
const Keyboard: React.FC<IKeyboard> = ({
	CHAR,
	characterStatusResult,
	handlePressKey,
}) => {
	return (
		<View className="items-center mb-20 gap-y-3">
			<View className="flex-row gap-x-2 ">
				{CHAR[0].map((el, idx) => (
					<TouchableOpacity onPress={() => handlePressKey(el)} key={idx}>
						<Text
							className={`w-8 text-center py-4 text-lg rounded-md bg-slate-300 
                                    dark:bg-slate-500 dark:text-slate-200
                            ${
															characterStatusResult[el] == "absent"
																? "text-slate-200 bg-slate-600 dark:bg-slate-700"
																: characterStatusResult[el] == "present"
																? "text-slate-200 bg-amber-600"
																: characterStatusResult[el] == "correct"
																? "text-slate-200 bg-green-700"
																: ""
														}`}>
							{el}
						</Text>
					</TouchableOpacity>
				))}
			</View>
			<View className="flex-row gap-x-2">
				{CHAR[1].map((el, idx) => (
					<TouchableOpacity onPress={() => handlePressKey(el)} key={idx}>
						<Text
							className={`w-9 text-center py-4 text-lg rounded-md bg-slate-300 
                                    dark:bg-slate-500 dark:text-slate-200
                            ${
															characterStatusResult[el] == "absent"
																? "text-slate-200 bg-slate-600 dark:bg-slate-700"
																: characterStatusResult[el] == "present"
																? "text-slate-200 bg-amber-600"
																: characterStatusResult[el] == "correct"
																? "text-slate-200 bg-green-700"
																: ""
														}
                            `}>
							{el}
						</Text>
					</TouchableOpacity>
				))}
			</View>
			<View className="flex-row gap-x-2">
				{CHAR[2].map((el, idx) => (
					<TouchableOpacity onPress={() => handlePressKey(el)} key={idx}>
						<Text
							className={`${
								el == "ENTER" ? "w-14 text-md py-5" : "w-8 text-lg py-4"
							}  ${
								el == "⌫" ? "w-12" : ""
							}  text-center   rounded-md bg-slate-300 
                                dark:bg-slate-500 dark:text-slate-200
                            ${
															characterStatusResult[el] == "absent"
																? "text-slate-200 bg-slate-600 dark:bg-slate-700"
																: characterStatusResult[el] == "present"
																? "text-slate-200 bg-amber-600"
																: characterStatusResult[el] == "correct"
																? "text-slate-200 bg-green-700"
																: ""
														}
                            `}>
							{el}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

export default memo(Keyboard);
