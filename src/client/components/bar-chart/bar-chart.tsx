import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTheme } from 'victory';
import {formatSchemaToDay} from '../../../utils/formatters';

// import { SchemasContext } from '../app/app';

type PropsType = {
	schemas: any;
}

class BarChart extends React.Component<PropsType> {
	// static contextType = SchemasContext;

	state = {
		data: this.props.schemas.thirdLayerSchemas.RevenuePerSuccessfulCall
	};

	render() {
		const { RevenuePerSuccessfulCall, CallsHandled } = this.props.schemas.thirdLayerSchemas;


		return (
			<div>
				<VictoryChart
					domainPadding={ 20 }
					width={ 500 }
					theme={ VictoryTheme.material }
					events={[
						{
							target: 'data',
							childName: 'barchart-1',
							eventHandlers: {
								onClick: () => {
									this.setState({
										data: this.state.data === RevenuePerSuccessfulCall ? CallsHandled : RevenuePerSuccessfulCall
									});

									return ({
										target: 'data',
										mutation: () => ({})
									});
								}
							}
						}
					]}
					animate={{duration: 1000 }}
				>
					<VictoryLabel text="RevenuePerSuccessfulCall" x={225} y={30} textAnchor="middle"/>
					<VictoryAxis
						// tickValues specifies both the number of ticks and where
						// they are placed on the axis
						tickValues={[1, 2, 3, 4, 5, 6]}
						style={ {
							tickLabels: { fontSize: 10 }
						} }
					/>
					<VictoryAxis
						dependentAxis
						// tickFormat specifies how ticks should be displayed
						tickFormat={(x) => (`$${x}`)}
					/>
					<VictoryBar
						animate={ true }
						name='barchart-1'
						data={ formatSchemaToDay(this.state.data) }
						x='timestamp'
						y='value'
					/>
				</VictoryChart>
			</div>
		);
	}
}

export default BarChart;
