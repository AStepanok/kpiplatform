import React from 'react';
import { hydrate } from 'react-dom';

import App from './components/app/app';

if (typeof window !== 'undefined') {
	window.__main = schemas => {
		// console.log(schemas);
		hydrate(<App schemas={ schemas }/>, document.getElementById('react-app'));
	};
}
