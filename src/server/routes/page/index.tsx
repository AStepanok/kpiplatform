import express from 'express';
import hbs from 'handlebars';
import {renderToString} from 'react-dom/server';
import App from '../../../client/components/app/app';
import React from 'react';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

import { schemas } from '../../index';

const router = express.Router();

let template: hbs.TemplateDelegate;

router.get('*', function (req, res) {
	if (!template) {
		template = handlebars.compile(
			fs.readFileSync(
				path.join(
					process.cwd(),
					'./build',
					'index.hbs'
				),
				'utf8'
			)
		);
	}

	const reactComp = renderToString(<App schemas={ schemas }/>);
	const htmlToSend = template({
		content: reactComp,
		state: JSON.stringify(schemas)
	});
	res.send(htmlToSend);
});

export default router;
