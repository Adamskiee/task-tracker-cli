#!/usr/bin/env node
"use strict"
import fs from 'fs';
import Tasks from './tasks.js';

const args = process.argv;
const myArgs = args.slice(2);

const options = myArgs[0];
const values = myArgs.slice(1);
const statuses = ['todo', 'in-progress', 'done'];

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
		writeJson('essen.json', essen);
	}catch(err){
		console.log("Error: ", err);
	}
}

function writeJson(file, json) {
	try{
		fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8'); 
	}catch(err){
		console.log('Error writing files: ', err);
	}
}

function showTasks(){
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
			tasks.showBy('done');
			break;
		case 'todo':
			tasks.showBy('todo');
			break;
		case 'in-progress':
			tasks.showBy('in-progress');
			break;
		default:
			console.log('Invalid args');
			break;
	}
}

function updateTask(){
	if(isNaN(values[0]) || values.length > 3){ 
		console.log('Invalid input');
		return;
	}	
	try{
		const id = parseInt(values[0]);
		const name = values[1];
		const description = values[2] || '';
		task = tasks.getObjById(id);
		if (!task) throw `id ${id} not found`;
		task.name = name; 
		task.description = description; 
		task.updatedAt = new Date().toString();
		console.log(`Task updated successfully (ID:${id})`);
		tasks.save();
	}catch (err) {
		console.log(`Error updating: ${err}`);
	}
}

function deleteTask(){
	if(isNaN(values[0]) || values.length > 1){
		console.log('Invalid input');
		return;
	}
	try {
		const id = parseInt(values[0]);
		
		taskIndex = tasks.getIndexById(id);
		if(taskIndex < 0) throw `id ${taskIndex} not found`;

		process.stdout.write('Are you sure? ');

		process.stdin.on('data', (data) =>{
			if(data.toString().trim() !== 'yes'){
				console.log('Deleting task failed');
				process.exit();	
			}else{
				tasks.deleteTaskById(taskIndex);
				tasks.save();
				console.log(`Task deleted successfully (ID:${id})`);
				process.exit();	
			}
		});
	} catch (err){
		console.log(`Error deleting: ${err}`);
	}
}

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
	try{
		values.forEach((id)=> {
			task = tasks.getObjById(id);
			if (!task) throw `id ${id} not found`;
			task.status = status; 
			console.log(`${task.name} is mark as ${status}`);	
			tasks.save();
		});
	}catch (err) {
		console.log(`Error marking task: ${err}`);
	}
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
		showTasks();
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
