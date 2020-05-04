import {Client, ClientType, IClient} from './client';
import {
	getRandomBoolean, getRandomDate, getRandomFromArray, getRandomIntInRange,
	getRandomNumOfProblems, getRandomNumOfSalesCalls,
	getRandomNumOfSupportCalls,
	getRandomProblemStatus, getRandomTechIssuesDuration
} from '../../../utils/random';
import {IProblem, Problem, ProblemType} from './problem';
import {IManager, Manager} from './manager';
import {ISupportCall, SupportCall, SupportCallType} from './support-call';
import {END_DATE, START_DATE} from '../../../utils/common';
import {AfterSupportCallWork, AfterSupportCallWorkType} from './after-support-call-work';
import {SalesCall, SalesCallType} from './sales-call';

function generateClients(count: number) {
	const clients: ClientType[] = [];

	for (let i = 0; i < count; i++) {
		const client: ClientType = {
			hardToWork: getRandomBoolean(0.65),
			willRecommend: getRandomBoolean(0.5),
			satisfied: getRandomBoolean(0.4)
		};

		clients.push(client);
	}

	return clients;
}

function generateProblems(clients: IClient[]) {
	const problems: ProblemType[] = [];

	clients.forEach((client) => {
		const numOfProblems = getRandomNumOfProblems();

		for (let i = 0; i < numOfProblems; i++) {
			const problem: ProblemType = {
				clientId: client._id,
				status: getRandomProblemStatus(),
				new: getRandomBoolean(0.3)
			};

			problems.push(problem);
		}
	});

	return problems;
}

function generateSupportCalls(problems: IProblem[], managers: IManager[]) {
	const supportCalls: SupportCallType[] = [];

	problems.forEach((problem) => {
		const numOfSupportCalls = getRandomNumOfSupportCalls();

		for (let i = 0; i < numOfSupportCalls; i++) {
			const clientWereWaiting = getRandomBoolean(0.6);
			const waitingDuration = clientWereWaiting ? getRandomIntInRange(1, 180) : 0;
			const wasHandled = clientWereWaiting ? getRandomBoolean(0.8) : true;
			const callbackRequest = wasHandled ? false : getRandomBoolean(0.5);
			const techIssuesDuration = wasHandled ? getRandomTechIssuesDuration() : 0;
			const duration = wasHandled ? getRandomIntInRange(5, 180) : 0;
			const solvedProblem = i + 1 < numOfSupportCalls || problem.status !== 'Solved';

			const supportCall: SupportCallType = {
				clientId: problem.clientId,
				problemId: problem._id,
				managerId: getRandomFromArray(managers)._id,
				timestamp: getRandomDate(START_DATE, END_DATE),
				clientWereWaiting,
				waitingDuration,
				wasHandled,
				callbackRequest,
				techIssuesDuration,
				duration,
				solvedProblem
			};

			supportCalls.push(supportCall);
		}
	});

	return supportCalls;
}

function generateAfterSupportCallWork(supportCalls: ISupportCall[]) {
	const afterSupportCallWorks: AfterSupportCallWorkType[] = [];

	supportCalls.forEach((supportCall) => {
		const duration = supportCall.wasHandled ? getRandomIntInRange(5, 180) : 0;

		const afterSupportCallWork: AfterSupportCallWorkType = {
			callId: supportCall._id,
			managerId: supportCall.managerId,
			problemId: supportCall.problemId,
			duration
		};

		afterSupportCallWorks.push(afterSupportCallWork);
	});

	return afterSupportCallWorks;
}

function generateSalesCalls(managers: IManager[]) {
	const salesCalls: SalesCallType[] = [];

	managers.forEach((manager) => {
		const numOfSalesCalls = getRandomNumOfSalesCalls();

		for (let i = 0; i < numOfSalesCalls; i++) {
			const successful = getRandomBoolean(0.3);
			const revenue = successful ? getRandomIntInRange(10, 5000) : 0;

			const salesCall: SalesCallType = {
				managerId: manager._id,
				timestamp: getRandomDate(START_DATE, END_DATE),
				successful,
				revenue,
				duration: getRandomIntInRange(5, 180)
			};

			salesCalls.push(salesCall);
		}
	});

	return salesCalls;
}

function dropCollections() {
	console.log('dropping collections...');

	Client.collection.drop();
	Manager.collection.drop();
	Problem.collection.drop();
	SupportCall.collection.drop();
	AfterSupportCallWork.collection.drop();
	SalesCall.collection.drop();

	console.log('done');
}

async function fillCollections(numOfClients: number, numOfManagers: number) {
	console.log('filling collections...');

	console.log('filling clients...');
	const rawClients = generateClients(numOfClients);
	const clients = await Client.create(rawClients);

	console.log('filling managers...');
	const managers = await Manager.create(new Array(numOfManagers).fill({}));

	console.log('filling problems...');
	const rawProblems = generateProblems(clients);
	const problems = await Problem.create(rawProblems);

	console.log('filling support calls...');
	const rawSupportCalls = generateSupportCalls(problems, managers);
	const supportCalls = await SupportCall.create(rawSupportCalls);

	console.log('filling support call works...');
	const rawAfterSupportCallWorks = generateAfterSupportCallWork(supportCalls);
	const afterSupportCallWorks = await AfterSupportCallWork.create(rawAfterSupportCallWorks);

	console.log('filling sales calls...');
	const rawSalesCalls = generateSalesCalls(managers);
	const salesCalls = await SalesCall.create(rawSalesCalls);

	return {
		clients,
		managers,
		problems,
		supportCalls,
		afterSupportCallWorks,
		salesCalls
	};
}

export default (numOfClients: number, numOfManagers: number) => {
	dropCollections();
	return fillCollections(numOfClients, numOfManagers);
};

export * from './client';
export * from './after-support-call-work';
export * from './manager';
export * from './problem';
export * from './sales-call';
export * from './support-call';
