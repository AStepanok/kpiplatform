import mongoose, { Schema } from 'mongoose';
import {formatDate} from '../../../utils/formatters';
import {END_DATE, START_DATE} from '../../../utils/common';
import { ISecondLayerSchema } from '../second-layer';

export type ThirdLayerSchemaType = {
	timestamp: string;
	value: number | string;
}

export interface IThirdLayerSchema extends mongoose.Document {
	timestamp: string;
	value: number | string;
}

const ThirdLayerSchema = new Schema({
	timestamp: { type: String, default: '' },
	value: { type: Schema.Types.Mixed, default: '' }
});

export const makeThirdLayerModel = (modelName: string) =>
	mongoose.model<IThirdLayerSchema>(modelName, ThirdLayerSchema);

export const fillThirdLayerSchemas = async (secondLayerSchemas: SchemasType, firstLayerSchemas: any) => {
	try {
		console.log('filling third layer schemas...');
		const thirdLayerSchemas: any = {};
		for (let key of Object.keys(THIRD_LAYER_SCHEMAS)) {
			// @ts-ignore
			console.log(`filling: ${THIRD_LAYER_SCHEMAS[key].code}`);
			// @ts-ignore
			const raw = THIRD_LAYER_SCHEMAS[key].generate(secondLayerSchemas, firstLayerSchemas);
			// @ts-ignore
			const result = await makeThirdLayerModel(THIRD_LAYER_SCHEMAS[key].code).create(raw);

			// @ts-ignore
			thirdLayerSchemas[THIRD_LAYER_SCHEMAS[key].code] = result;
		}

		return thirdLayerSchemas;
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

	const result: ThirdLayerSchemaType[] = [];
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

type SchemasType = {
	SupportCallsCount: ISecondLayerSchema[];
	SupportCallsWithWaitingCount: ISecondLayerSchema[];
	SupportCallsHandledCount: ISecondLayerSchema[];
	SupportCallsWithNewProblemCount: ISecondLayerSchema[];
	SupportCallsWithWaitingLessThanMinuteCount: ISecondLayerSchema[];
	SupportCallsWithCallbackRequestCount: ISecondLayerSchema[];
	SupportCallsSolvedProblemCount: ISecondLayerSchema[];
	SupportCallsNumberToSolveProblemCount: ISecondLayerSchema[];
	SupportCallsHandledTotalTime: ISecondLayerSchema[];
	SupportCallsWithWaitingTotalTime: ISecondLayerSchema[];
	SupportCallsWithWaitingTimeMaximum: ISecondLayerSchema[];
	SupportCallsHandledTechnicalIssuesTotalTime: ISecondLayerSchema[];
	SupportCallsSolvedTotalTimeToSolve: ISecondLayerSchema[];
	ManagersSalesCallsCountAverage: ISecondLayerSchema[];
	ManagersSalesCallsTimeAverage: ISecondLayerSchema[];
	SalesCallsCount: ISecondLayerSchema[];
	ManagersNotWorkingTimeAverage: ISecondLayerSchema[];
	SalesCallsRevenue: ISecondLayerSchema[];
	SalesCallsCost: ISecondLayerSchema[];
	SupportCallsSolvedProblemWithSingleCallCount: ISecondLayerSchema[];
	SupportCallsSolvedCallTimeToSolve: ISecondLayerSchema[];
	SalesCallsSuccessfulCount: ISecondLayerSchema[];
}

export const THIRD_LAYER_SCHEMAS = {
	CallResolutionRate: {
		code: 'CallResolutionRate',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (100 * schemas.SupportCallsSolvedProblemCount.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SupportCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	AverageAgeOfQuery: {
		code: 'AverageAgeOfQuery',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SupportCallsSolvedTotalTimeToSolve.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SupportCallsSolvedProblemCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	FirstCallResolution: {
		code: 'FirstCallResolution',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SupportCallsSolvedProblemWithSingleCallCount.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SupportCallsSolvedProblemCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	AfterCallWorkTime: {
		code: 'AfterCallWorkTime',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return ((schemas.SupportCallsSolvedTotalTimeToSolve.find(
					(call) => call.timestamp === formattedDate
				).value - schemas.SupportCallsSolvedCallTimeToSolve.find(
					(call) => call.timestamp === formattedDate
				).value) / schemas.SupportCallsSolvedProblemCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	TimeLostDueTechnologiesIssues: {
		code: 'TimeLostDueTechnologiesIssues',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SupportCallsHandledTechnicalIssuesTotalTime.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SupportCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	NumberOfCallsPerQuery: {
		code: 'NumberOfCallsPerQuery',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SupportCallsNumberToSolveProblemCount.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SupportCallsSolvedProblemCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	CallAbandonedRate: {
		code: 'CallAbandonedRate',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return ((schemas.SupportCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value - schemas.SupportCallsHandledCount.find(
					(call) => call.timestamp === formattedDate
				).value) / schemas.SupportCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	AverageCallLength: {
		code: 'AverageCallLength',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SupportCallsHandledTotalTime.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SupportCallsHandledCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	FirstResponseTime: {
		code: 'FirstResponseTime',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SupportCallsWithWaitingTotalTime.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SupportCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	PercentageOfCallsBlocked: {
		code: 'PercentageOfCallsBlocked',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (100 * schemas.SupportCallsWithWaitingCount.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SupportCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	ProfitPerCall: {
		code: 'ProfitPerCall',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SalesCallsRevenue.find(
					(call) => call.timestamp === formattedDate
				).value - schemas.SalesCallsCost.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	CostPerCall: {
		code: 'CostPerCall',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SalesCallsCost.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SalesCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	RevenuePerSuccessfulCall: {
		code: 'RevenuePerSuccessfulCall',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SalesCallsRevenue.find(
					(call) => call.timestamp === formattedDate
				).value / schemas.SalesCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	AgentUtilization: {
		code: 'AgentUtilization',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (3600 - schemas.ManagersNotWorkingTimeAverage.find(
					(call) => call.timestamp === formattedDate
				).value / 36) || 0;
			});
		}
	},
	SalesPerAgent: {
		code: 'SalesPerAgent',
		generate: (schemas: SchemasType, firstLayerSchemas: any) => {
			return iterate((formattedDate: string) => {
				return (schemas.SalesCallsSuccessfulCount.find(
					(call) => call.timestamp === formattedDate
				).value / firstLayerSchemas.managers.length) || 0;
			});
		}
	},
	CallsHandled: {
		code: 'CallsHandled',
		generate: (schemas: SchemasType, firstLayerSchemas: any) => {
			return iterate((formattedDate: string) => {
				return (schemas.SalesCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value / firstLayerSchemas.managers.length) || 0;
			});
		}
	},
	AverageSpeedOfAnswer: {
		code: 'CallsHandled',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (schemas.SalesCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value / 3600 - schemas.ManagersNotWorkingTimeAverage.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
	RepeatIssues: {
		code: 'RepeatIssues',
		generate: (schemas: SchemasType) => {
			return iterate((formattedDate: string) => {
				return (100 * (schemas.SupportCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value - schemas.SupportCallsWithNewProblemCount.find(
					(call) => call.timestamp === formattedDate
				).value) / schemas.SupportCallsCount.find(
					(call) => call.timestamp === formattedDate
				).value) || 0;
			});
		}
	},
};

function dropThirdLayerSchemas() {
	Object.keys(THIRD_LAYER_SCHEMAS).forEach(async (key: keyof typeof THIRD_LAYER_SCHEMAS) => {
		await makeThirdLayerModel(THIRD_LAYER_SCHEMAS[key].code).collection.drop();
	});
}

export default (schemas: SchemasType, firstLayerSchemas: any) => {
	dropThirdLayerSchemas();
	return fillThirdLayerSchemas(schemas, firstLayerSchemas);
};

