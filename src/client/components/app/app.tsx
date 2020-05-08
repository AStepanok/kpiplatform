import React from 'react';

import BarChart from '../bar-chart/bar-chart';

import './app.css';
import {FORMAT_SCHEMAS_Y_AXIS} from '../../../utils/common';

type PropsType = {
	kpi: any,
	schemas: any
}

class App extends React.Component<PropsType> {
	state = {
		selectedKpi: 'root',
		expanded: false,
		showHours: false,
		prevKPI: ''
	};

	render() {
		const { kpi, schemas } = this.props;
		const { selectedKpi, expanded, showHours, prevKPI } = this.state;
		console.log(this.state);
		// console.log(selectedKpi);
		const selectedKpiInfo = kpi.find(k => k.code === selectedKpi);

		return (
			<div className='content'>
				{ selectedKpi === 'root' ? (
					<>
					</>
				) : this.renderSchemas() }
			</div>
		);
	}

	renderSchemas = () => {
		const { kpi, schemas } = this.props;
		const { selectedKpi, expanded, showHours, prevKPI } = this.state;
		console.log(this.state);
		// console.log(selectedKpi);
		const selectedKpiInfo = kpi.find(k => k.code === selectedKpi);

		return (
			<>
				{
					(selectedKpiInfo.rootKPI || expanded) && (
						<div>
							<button onClick={() => this.handleGoBack(kpi.find(k => k.code === selectedKpiInfo.rootKPI))}>{
								`<- ${expanded ? selectedKpi : selectedKpiInfo.rootKPI}`
							} </button>
						</div>
					)
				}
				{
					expanded && selectedKpiInfo.linkedKPICodes && selectedKpiInfo.linkedKPICodes.length ? (
						selectedKpiInfo.linkedKPICodes.map((code: string) => (
							<div key={code} onClick={ () => {
								this.handleSchemaClick(kpi.find(k => k.code === code));
							} }>
								{
									schemas[code].length ? (
										<BarChart
											schema={ schemas[code] }
											label={ code }
											formatY={FORMAT_SCHEMAS_Y_AXIS.find(k => k.codes.includes(code)).format}
											showHours={ showHours }
										/>
									) : (
										<>
											<h3>{ code }</h3>
											<p>{ schemas[code] }</p>
										</>
									)
								}
							</div>
						))
					) : (
						<div onClick={ () => {
							this.handleSchemaClick(selectedKpiInfo);
						} }>
							{
								schemas[selectedKpi].length ? (
									<BarChart
										schema={ schemas[selectedKpi] }
										label={ selectedKpi }
										formatY={FORMAT_SCHEMAS_Y_AXIS.find(k => k.codes.includes(selectedKpi)).format}
										showHours={ showHours }
									/>
								) : (
									<>
										<h3>{ selectedKpi }</h3>
										<p>{ schemas[selectedKpi] }</p>
									</>
								)
							}
						</div>
					)
				}
			</>
		);
	}

	handleGoBack = (schema) => {
		const { selectedKpi, expanded } = this.state;

		if (expanded) {
			this.setState({
				expanded: false,
				showHours: false
			});
		} else {
			this.setState({
				selectedKpi: schema.code,
				expanded: !(schema.linkedKPICodes.length && schema.linkedKPICodes.length === 1),
				showHours: false
			});
		}
	}

	handleSchemaClick = (schema, prev) => {
		const { selectedKpi, expanded, showHours } = this.state;
		console.log(schema);
		if (schema.code === selectedKpi) {
			if (expanded || !schema.linkedKPICodes.length) {
				this.setState({
					showHours: !showHours
				});
			} else {
				this.setState({
					expanded: true,
				});
			}
		} else {
			if (schema.linkedKPICodes && schema.linkedKPICodes.length) {
				this.setState({
					selectedKpi: schema.code,
					expanded: true,
					showHours: false
				});
			} else {
				this.setState({
					selectedKpi: schema.code,
					expanded: false,
					showHours: true
				});
			}
		}
	}
}

export default App;
