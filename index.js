#!/usr/bin/env node

import { promises as fsPro } from 'fs';
import fs from 'fs';
import Tasks from './tasks.js';

const args = process.argv;
const myArgs = args.slice(2);

const options = myArgs[0];
const values = myArgs.slice(1);

let tasksObj;
let taskIndex = -1;
let essen = {};
let tasks;
let task = {};

function addTask(){
	try{
		if(values && values.length<0){
			return;
		}

		task = {};
		task.id = essen.id;
		task.name = values[0];	
		task.description = values[1] || '';
		task.status = 'todo';
		task.createdAt = new Date().toString();
		task.updatedAt = new Date().toString();
		tasks.push(task);
		
		console.log(`Task added successfully (ID: ${task.id})`);
		essen.id++;
		tasks.save();
		//writeJson('tasks.json', tasks);
		writeJson('essen.json', essen);
	}catch(err){
		console.log("Error: ", err);
	}
}

async function writeJson(file, json) {
	try{
		await fsPro.writeFile(file, JSON.stringify(json, null, 2), 'utf8'); 
	}catch(err){
		console.log('Error writing files: ', err);
	}
}

function showTaskList(){
	if(values.length > 2){
		console.log('Invalid input');
		return;
	}

	if(values.length < 1){
		tasks.show();
		return;
	}

	const filterStatus = values[0];
	switch(filterStatus){
		case 'done':
			tasks.showTaskBy('done');
			break;
		case 'todo':
			tasks.showTaskBy('todo');
			break;
		case 'in-progress':
			tasks.showTaskBy('in-progress');
			break;
		default:
			console.log('invalid args');
	}
}

function updateTask(){
	if(isNaN(values[0]) || values.length > 3){ 
		console.log('Invalid input');
		return;
	}	

	const id = parseInt(values[0]);
	const name = values[1];
	const description = values[2] || '';
	task = tasks.getObjById(id);
	task.name = name; 
	task.description = description; 
	task.updatedAt = new Date().toString();
	console.log(`Task updated successfully (ID:${id})`);
	tasks.save();
}

function deleteTask(){
	if(isNaN(values[0]) || values.length > 1){
		console.log('Invalid input');
		return;
	}

	const id = parseInt(values[0]);
	
	taskIndex = tasks.getIndexById(id);

	process.stdout.write('Are you sure? ');

	process.stdin.on('data', (data) =>{
		if(data.toString().trim() !== 'yes'){
			console.log('Deleting task failed');
			process.exit();	
		}else{
			tasks.deleteTaskById(taskIndex);
			console.log(`Task deleted successfully (ID:${id})`);
			process.exit();	
		}
	});	
}

const statuses = ['todo', 'in-progress', 'done'];

function markTask(){
	if( values.length < 1 || !statuses.includes(values[0]) ) {
		console.log('Invalid input');
		return;
	}
	
	const status = values[0];
	values.shift();

	if(values.some( (value) => isNaN(value)) ){
		console.log('Invalid input');
		return;
	}

	values.forEach((id)=> {
		task = tasks.getObjById(id);
		task.status = status; 
		console.log(`${task.name} is mark as ${status}`);	
		tasks.save();
	});
}

function init(){
	try{
		const essenData = fs.readFileSync('essen.json', 'utf8')
	
		tasks = new Tasks();

		if(essenData){
			essen = JSON.parse(essenData);
			console.log('Data id updated');
		}else{
			essen.id = 1;
		}
	}catch(err){
		console.error('Error reading file: ', err);
	}
}

init();

switch(options){
	case 'add':
		addTask();
		break;
	case 'list':
		showTaskList();
		break;
	case 'update':
		updateTask();
		break;
	case 'delete':
		deleteTask();
		break;
	case 'mark':
		markTask();
		break;
	default:
		break;
}
