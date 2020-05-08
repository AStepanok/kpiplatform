import mongoose, { Schema } from 'mongoose';
import {formatDate} from '../../../utils/formatters';
import {END_DATE, START_DATE} from '../../../utils/common';
import {IAfterSupportCallWork, IClient, IManager, IProblem, ISalesCall, ISupportCall} from '../first-layer';

export type SecondLayerSchemaType = {
	timestamp: string;
	value: number | string;
}

export interface ISecondLayerSchema extends mongoose.Document {
	timestamp: string;
	value: number;
}

const SecondLayerSchema = new Schema({
	timestamp: { type: String, default: '' },
	value: { type: Schema.Types.Mixed, default: '' }
});

export const makeSecondLayerModel = (modelName: string) =>
	mongoose.model<ISecondLayerSchema>(modelName, SecondLayerSchema);

type SchemasType = {
	clients: IClient[];
	managers: IManager[];
	problems: IProblem[];
	supportCalls: ISupportCall[];
	afterSupportCallWorks: IAfterSupportCallWork[];
	salesCalls: ISalesCall[];
}

export const fillSecondLayerSchemas = async (firstLayerSchemas: SchemasType) => {
	try {
		console.log('filling second layer schemas...');
		const secondLayerSchemas: any = {};
		for (let key of Object.keys(SECOND_LAYER_SCHEMAS)) {
			// @ts-ignore
			console.log(`filling: ${SECOND_LAYER_SCHEMAS[key].code}`);
			// @ts-ignore
			const raw = SECOND_LAYER_SCHEMAS[key].generate(firstLayerSchemas);
			// @ts-ignore
			const result = await makeSecondLayerModel(SECOND_LAYER_SCHEMAS[key].code).create(raw);

			// @ts-ignore
			secondLayerSchemas[SECOND_LAYER_SCHEMAS[key].code] = result;
		}

		return secondLayerSchemas;
	} catch (e) {
		console.error(e);

		return 1;
	}
};

function iterate(getValue: Function) {
	// @ts-ignore
	Date.prototype.addHours = function(h: number) {
		this.setTime(this.getTime() + (h*60*60*1000));
		return this;
	};

	const result: SecondLayerSchemaType[] = [];
	const date = new Date(START_DATE.getTime());
	let formattedDate: string;

	while (date.getTime() <= END_DATE.getTime()) {
		formattedDate = formatDate(date);

		const value = getValue(formattedDate);

		result.push({
			value,
			timestamp: formattedDate
		});

		// @ts-ignore
		date.addHours(1);
	}

	return result;
}

export const SECOND_LAYER_SCHEMAS = {
	SupportCallsCount: {
		code: 'SupportCallsCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.supportCalls.filter((call) => call.timestamp === formattedDate).length;
			});
		}
	},
	SupportCallsWithWaitingCount: {
		code: 'SupportCallsWithWaitingCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.clientWereWaiting
				).length;
			});
		}
	},
	SupportCallsHandledCount: {
		code: 'SupportCallsHandledCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.wasHandled
				).length;
			});
		}
	},
	SupportCallsWithNewProblemCount: {
		code: 'SupportCallsWithNewProblemCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const calls = schemas.supportCalls.filter((call) => call.timestamp === formattedDate);

				return calls.filter((call) => schemas.problems.find(
					problem => problem._id === call.problemId).new
				).length;
			});
		}
	},
	CustomerCallsAnsweredInTheFirstMinute: {
		code: 'CustomerCallsAnsweredInTheFirstMinute',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.clientWereWaiting && call.waitingDuration <= 60
				).length;
			});
		}
	},
	CallbackRequests: {
		code: 'CallbackRequests',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.callbackRequest
				).length;
			});
		},
		linkedKPICodes: ['LongestHoldTime', 'CustomerCallsAnsweredInTheFirstMinute', 'TimeLostDueTechnologiesIssues'],
	},
	SupportCallsSolvedProblemCount: {
		code: 'SupportCallsSolvedProblemCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.solvedProblem
				).length;
			});
		}
	},
	SupportCallsSolvedProblemWithSingleCallCount: {
		code: 'SupportCallsSolvedProblemWithSingleCallCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const resolvedCalls = schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.solvedProblem
				);

				return resolvedCalls.filter((call) => {
					const problem = schemas.problems.find(p => p._id === call.problemId);

					const relatedCalls =
						schemas.supportCalls.filter((relatedCall) => relatedCall.problemId === problem._id);

					return relatedCalls.length === 1;
				}).length;
			});
		}
	},
	SupportCallsNumberToSolveProblemCount: {
		code: 'SupportCallsNumberToSolveProblemCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const solvedCalls = schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.solvedProblem
				);

				let numberOfProblemCalls = 0;

				solvedCalls.forEach((solvedCall) => {
					const relatedCalls = schemas.supportCalls.filter(
						(call) => call.problemId === solvedCall.problemId
					).length;
					numberOfProblemCalls+=relatedCalls;
				});

				return numberOfProblemCalls;
			});
		}
	},
	SupportCallsHandledTotalTime: {
		code: 'SupportCallsHandledTotalTime',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const handledCalls = schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.wasHandled
				);

				return handledCalls.reduce((time, call) => {
					return time + call.duration;
				}, 0);
			});
		}
	},
	SupportCallsWithWaitingTotalTime: {
		code: 'SupportCallsWithWaitingTotalTime',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const clientWereWaitingCalls = schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.clientWereWaiting
				);

				return clientWereWaitingCalls.reduce((time, call) => {
					return time + call.waitingDuration;
				}, 0);
			});
		}
	},
	LongestHoldTime: {
		code: 'LongestHoldTime',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const clientWereWaitingCalls = schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.clientWereWaiting
				);
				let maximum = 0;

				clientWereWaitingCalls.forEach((call) => {
					if (maximum < call.waitingDuration) {
						maximum = call.waitingDuration;
					}
				});

				return maximum;
			});
		}
	},
	SupportCallsHandledTechnicalIssuesTotalTime: {
		code: 'SupportCallsHandledTechnicalIssuesTotalTime',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const handledCalls = schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.wasHandled
				);

				return handledCalls.reduce((time, call) => {
					return time + call.techIssuesDuration;
				}, 0);
			});
		}
	},
	SupportCallsSolvedTotalTimeToSolve: {
		code: 'SupportCallsSolvedTotalTimeToSolve',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const solvedCalls = schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.solvedProblem
				);

				let totalSolvingTime = 0;

				solvedCalls.forEach((solvedCall) => {
					const relatedCalls = schemas.supportCalls.filter(
						(call) => call.problemId === solvedCall.problemId
					);

					relatedCalls.forEach((relatedCall) => {
						totalSolvingTime += relatedCall.duration;
						const afterWork =
							schemas.afterSupportCallWorks.find(work => work.callId === relatedCall._id);
						totalSolvingTime += afterWork.duration;
					});
				});

				return totalSolvingTime;
			});
		}
	},
	SupportCallsSolvedCallTimeToSolve: {
		code: 'SupportCallsSolvedCallTimeToSolve',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const solvedCalls = schemas.supportCalls.filter((call) =>
					(call.timestamp === formattedDate) && call.solvedProblem
				);

				let totalCallingTime = 0;

				solvedCalls.forEach((solvedCall) => {
					const relatedCalls = schemas.supportCalls.filter(
						(call) => call.problemId === solvedCall.problemId
					);

					relatedCalls.forEach((relatedCall) => {
						totalCallingTime += relatedCall.duration;
					});
				});

				return totalCallingTime;
			});
		}
	},
	ManagersSalesCallsCountAverage: {
		code: 'ManagersSalesCallsCountAverage',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.salesCalls.filter(
					(call) => call.timestamp === formattedDate
				).length / schemas.managers.length;
			});
		}
	},
	ManagersSalesCallsTimeAverage: {
		code: 'ManagersSalesCallsTimeAverage',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const salesCalls =  schemas.salesCalls.filter(
					(call) => call.timestamp === formattedDate
				);

				const totalDuration = salesCalls.reduce((time, call) => time + call.duration, 0);

				return totalDuration / schemas.managers.length;
			});
		}
	},
	SalesCallsCount: {
		code: 'SalesCallsCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.salesCalls.filter(
					(call) => call.timestamp === formattedDate
				).length;
			});
		}
	},
	SalesCallsSuccessfulCount: {
		code: 'SalesCallsSuccessfulCount',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.salesCalls.filter(
					(call) => call.timestamp === formattedDate && call.successful
				).length;
			});
		}
	},
	ManagersNotWorkingTimeAverage: {
		code: 'ManagersNotWorkingTimeAverage',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				let totalWorkingTime = 0;

				schemas.managers.forEach((manager) => {
					const managerSalesCalls = schemas.salesCalls.filter((call) =>
						call.timestamp === formattedDate && call.managerId === manager._id
					);

					managerSalesCalls.forEach((salesCall) => {
						totalWorkingTime += salesCall.duration;
					});

					const managerSupportCalls = schemas.supportCalls.filter((call) =>
						call.timestamp === formattedDate && call.managerId === manager._id
					);

					managerSupportCalls.forEach((supportCall) => {
						totalWorkingTime += supportCall.duration;

						const afterCallWork = schemas.afterSupportCallWorks.find((work) => work.callId === supportCall._id);

						totalWorkingTime += afterCallWork?.duration || 0;
					});
				});

				return (3600 * schemas.managers.length - totalWorkingTime) / schemas.managers.length;
			});
		}
	},
	SalesCallsRevenue: {
		code: 'SalesCallsRevenue',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				const salesCalls = schemas.salesCalls.filter(
					(call) => call.timestamp === formattedDate
				);

				return salesCalls.reduce((revenue, call) => revenue + call.revenue, 0);
			});
		}
	},
	SalesCallsCost: {
		code: 'SalesCallsCost',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return schemas.salesCalls.filter(
					(call) => call.timestamp === formattedDate
				).length * 5;
			});
		}
	}
};

function dropSecondLayerSchemas() {
	Object.keys(SECOND_LAYER_SCHEMAS).forEach(async (key: keyof typeof SECOND_LAYER_SCHEMAS) => {
		await makeSecondLayerModel(SECOND_LAYER_SCHEMAS[key].code).collection.drop();
	});
}

export default (schemas: SchemasType) => {
	dropSecondLayerSchemas();
	return fillSecondLayerSchemas(schemas);
};

