import React from 'react';

import BarChart from '../bar-chart/bar-chart';

import './app.css';

type PropsType = {
	schemas: any;
}

class App extends React.Component<PropsType> {
	render() {
		return (
			<div  className='content'>
				<BarChart schemas={ this.props.schemas }/>
			</div>
		);
	}
}

export default App;
