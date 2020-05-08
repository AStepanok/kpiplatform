import React from 'react';
import { hydrate } from 'react-dom';

import App from './components/app/app';

if (typeof window !== 'undefined') {
	window.__main = state => {
		// console.log(schemas);
		hydrate(<App { ...state } />, document.getElementById('react-app'));
	};
}
