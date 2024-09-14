export const wordleAlgorithm = (guess: string, solution: string) => {
	const charStatus: { [key: string]: string } = {};
	const splitSolution = solution.split("");
	const splitGuess = guess.split("");
	const solutionCharsTaken = splitSolution.map((_) => false);
	const statuses = Array.from(Array(guess.length));
	/*
   Correct Cases
  */
	splitGuess.forEach((letter, i) => {
		if (letter === splitSolution[i]) {
			statuses[i] = "correct";
			solutionCharsTaken[i] = true;
			charStatus[letter.toUpperCase()] = "correct";
			return;
		}
	});
	/*
   Absent Cases
  */
	splitGuess.forEach((letter, i) => {
		if (statuses[i]) return;
		if (!splitSolution.includes(letter)) {
			charStatus[letter.toUpperCase()] = "absent";
			return (statuses[i] = "absent");
		}
		/*
    Present Cases
    */
		const indexOfPresentChar = splitSolution.findIndex(
			(x, index) => x === letter && !solutionCharsTaken[index],
		);
		if (indexOfPresentChar > -1) {
			statuses[i] = "present";
			charStatus[letter.toUpperCase()] = "present";
			solutionCharsTaken[indexOfPresentChar] = true;
			return;
		} else {
			charStatus[letter.toUpperCase()] = "absent";
			return (statuses[i] = "absent");
		}
	});
	return { statuses, charStatus };
};
