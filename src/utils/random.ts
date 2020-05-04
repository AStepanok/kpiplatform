import { PROBLEM_STATUSES } from './common';
import {formatDate} from './formatters';

export const getRandomBoolean = (probability: number) => Math.random() >= probability;

export const getRandomFromArray = (arr: any[]) => {
	let idx = Math.floor(Math.random() * arr.length);
	return arr[idx];
};

export const getRandomNumOfProblems = () => {
	let notRandomNumbers = [1, 1, 1, 2, 2, 2, 3, 3, 4, 5];
	return getRandomFromArray(notRandomNumbers);
};

export const getRandomNumOfSupportCalls = () => {
	let notRandomNumbers = [1, 1, 1, 2, 2, 2, 2, 3, 3, 4];
	return getRandomFromArray(notRandomNumbers);
};

export const getRandomNumOfSalesCalls = () => {
	let notRandomNumbers = [21, 21, 35, 35, 70, 70, 140, 140, 210, 280];
	return getRandomFromArray(notRandomNumbers);
};

export const getRandomProblemStatus = () => {
	let notRandomNumbers = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2];
	return PROBLEM_STATUSES[getRandomFromArray(notRandomNumbers)];
};

export const getRandomTechIssuesDuration = () => {
	let notRandomNumbers = [0, 0, 0, 0, 0, 0, 5, 5, 5, 10];
	return getRandomFromArray(notRandomNumbers);
};

export const getRandomIntInRange = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomDate = (start: Date, end: Date) => {
	const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	return formatDate(date);
};
