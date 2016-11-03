import test from 'ava';
import fs from 'fs';
import path from 'path';
import del from 'del';
import nodePlop from '../lib/index.js';

const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src/basic-no-plopfile`;
const plop = nodePlop();
const clear = () => {
	del.sync(testSrcPath);
};

test.before( () => {
	const name = 'basic test name';
	plop.addHelper('uCase', txt => txt.toUpperCase());
	plop.setGenerator('basic-add-no-plopfile', {
		description: 'adds a file using a template',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your name?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			}
		],
		actions: [
			{
				type: 'add',
				path: `${testSrcPath}/{{dashCase name}}.txt`,
				template: '{{uCase name}}'
			}
		]
	});

	const basicAdd = plop.getGenerator('basic-add-no-plopfile');
	return basicAdd.runActions({name});
});
test.after(clear);

test('Check that the file has been created', t => {
	const filePath = path.resolve(testSrcPath, 'basic-test-name.txt')
	
	t.true(fs.existsSync(filePath));
});

test('Test the content of the rendered file', t => {
	const filePath = path.resolve(testSrcPath, 'basic-test-name.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content === 'BASIC TEST NAME');
});