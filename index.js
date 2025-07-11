#!/usr/bin/env node

import { promises as fsPro } from 'fs';
import fs from 'fs';

const args = process.argv;
const myArgs = args.slice(2);

const options = myArgs[0];
const values = myArgs.slice(1);

let index = -1;

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
		
		writeJson('tasks.json', tasks);
		writeJson('essen.json', essen);
	}catch(err){
		console.err("Error: ", err);
	}
}

async function writeJson(file, json){
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
		for(task of tasks){
			console.log(task.name);
		}
		return;
	}

	const filterStatus = values[0];
	switch(filterStatus){
		case 'done':
			showTaskBy('done');
			break;
		case 'todo':
			showTaskBy('todo');
			break;
		case 'in-progress':
			showTaskBy('in-progress');
			break;
		default:
			console.log('invalid args');
	}
}

function showTaskBy(status){
	for(task of tasks){
		if(task.status === status){
			console.log(task.name);
		}
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

	for(task of tasks){
		if(task.id === id){
			task.name = name;
			task.description = description;	
			console.log(`Task updated successfully (ID:${id})`);
			writeJson('tasks.json', tasks);
			break;
		}
	}
}

function deleteTask(){
	if(isNaN(values[0]) || values.length > 1){
		console.log('Invalid input');
		return;
	}

	const id = parseInt(values[0]);
	for (index in tasks){
		if(tasks[index].id === id){
			process.stdout.write('Are you sure? ');

			process.stdin.on('data', (data) =>{
				if(data.toString().trim() !== 'yes'){
					console.log('Deleting task failed');
					process.exit();	
				}else{
					tasks.splice(index, 1);
					console.log(`Task deleted successfully (ID:${id})`);
					writeJson('tasks.json', tasks);
					process.exit();	
				}
			});	

			break;
		}
	}
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
		for ( task of tasks ) {
			
			console.log(task.id);
			if(task.id == id){
				task.status = status;
				console.log(`${task.name} is mark as ${status}`);	
				writeJson('tasks.json', tasks);	
				break;
					
			}
		}
	});
}

function init(){
	try{
		const tasksData = fs.readFileSync('tasks.json', 'utf8');
		const essenData = fs.readFileSync('essen.json', 'utf8')
		
		if(tasksData){
			tasks = JSON.parse(tasksData);
			console.log('Data updated');
		}

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
