import {formatDate} from './formatters';
import {ISupportCall} from '../server/db/first-layer';
import {SecondLayerSchemaType} from '../server/db/second-layer';

export const START_DATE = new Date(2020, 0, 1);
export const END_DATE = new Date(2020, 0, 7);

export const PROBLEM_STATUSES = [
	'In Progress',
	'Solved',
	'Failed'
];

export const FORMAT_SCHEMAS_Y_AXIS = [
	{
		codes: ['CallResolutionRate', 'FirstCallResolution', 'CallAbandonedRate'],
		format: (value: number) => `${value}%`
	},
	{
		codes: ['AverageAgeOfQuery', 'AfterCallWorkTime', 'TimeLostDueTechnologiesIssues', 'AverageCallLength'],
		format: (value: number) => `${value}sec.`
	},
	{
		codes: ['NumberOfCallsPerQuery'],
		format: (value: number) => `${value} calls`
	}
];


const rootkpis = ['NetPromoterScore', 'ProfitPerCall', 'Repeat Issues', 'Peak Hour Traffic'];
