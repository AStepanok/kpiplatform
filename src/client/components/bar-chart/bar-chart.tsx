import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTheme } from 'victory';
import {formatSchemaToDay} from '../../../utils/formatters';

type PropsType = {
	schema: {
		timestamp: string;
		value: number;
	}[];
	label: string;
	formatY: any;
	showHours: boolean;
}

class BarChart extends React.Component<PropsType> {
	render() {
		const { schema, label, formatY, showHours } = this.props;
		return (
			<div>
				<VictoryChart
					domainPadding={ 20 }
					width={ 500 }
					theme={ VictoryTheme.material }
					animate={{duration: 1000 }}
				>
					<VictoryLabel text={ label } x={225} y={30} textAnchor="middle"/>
					<VictoryAxis
						style={ {
							tickLabels: { fontSize: showHours ? 0 : 10 }
						} }
					/>
					<VictoryAxis
						dependentAxis
						tickFormat={ formatY }
						style={ {
							tickLabels: { fontSize: 10 }
						} }
					/>
					<VictoryBar
						animate={ true }
						name='barchart-1'
						data={ showHours ? schema : formatSchemaToDay(schema) }
						x='timestamp'
						y='value'
					/>
				</VictoryChart>
			</div>
		);
	}
}

export default BarChart;
