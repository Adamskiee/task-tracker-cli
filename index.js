#!/usr/bin/env node

const args = process.argv;
const myArgs = args.slice(2);

const options = myArgs[0];
const values = myArgs.slice(1);
let id = 1;

console.log( values[0]);

function addTask(){
	if(values && values.length<0){
		return;
	}
	
	console.log(`Task added successfully (ID: ${id})`);
	id++;
}

switch(options){
	case 'add':
		addTask();
		break;
	default:
		break;
}
