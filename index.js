#!/usr/bin/env node

import { promises as fsPro } from 'fs';
import fs from 'fs';

const args = process.argv;
const myArgs = args.slice(2);

const options = myArgs[0];
const values = myArgs.slice(1);
// let id = 1;
let essen = {};
let tasks = [];
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
	writeTaskJson();
	}catch(err){
		console.err("Error: ", err);
	}
}

async function writeTaskJson(){
	try{
		await fsPro.writeFile('tasks.json', JSON.stringify(tasks, null, 2), 'utf8'); 
		await fsPro.writeFile('essen.json', JSON.stringify(essen, null, 2), 'utf8');
	}catch(err){
		console.log('Error writing files: ', err);
	}
}

function updateTask(){
	if(isNaN(values[0]) || values.length < 2){ return;
	}
	console.log(`Task updated successfully (ID:${values[0]})`);

}

function deleteTask(){
	if(isNaN(values[0]) || values.length < 1){
		return;
	}
	console.log(`Task deleted successfully (ID:${values[0]})`);
}

function init(){
	try{
		const tasksData = fs.readFileSync('tasks.json', 'utf8');
		const essenData = fs.readFileSync('essen.json', 'utf8')
		
		console.log(tasksData);
		if(tasksData){
			tasks = JSON.parse(tasksData);
			console.log('Data updated');
		}
		console.log(essenData);
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
		console.log(tasks);
		console.log(essen);
		addTask();
		break;
	case 'update':
		updateTask();
		break;
	case 'delete':
		deleteTask();
		break;
	default:
		break;
}
