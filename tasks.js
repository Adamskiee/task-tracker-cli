"use strict"
import fs from 'fs';

export default class Tasks {
	constructor() {
		this.tasks = [];
		this.load();
	}

	getIndexById( id ) {
		return this.tasks.indexOf(this.tasks.find( (task) => task.id == id));
	}

	getObjById( id ) {
		return this.tasks.find( (task) => task.id == id );
	}
	
	push( task ) {
		this.tasks.push( task );
	}
	
	deleteTaskById( index ) {
		this.tasks.splice( index, 1 );
	}
	
	show() {
		let task;
		for (task of this.tasks) {
			console.log(task.name);
		}
	}
	
	showBy(status){
		let task;
		for(task of this.tasks){
			if(task.status === status){
				console.log(task.name);
			}
		}
	}

	save() {
		try {
			fs.writeFileSync('tasks.json', JSON.stringify(this.tasks, null, 2), 'utf8');
			console.log('Saved Successfully');	
		}catch (err) {
			console.err('Error writing file: ', err);
		}
	}
	
	load() {
		try {
			const data = fs.readFileSync('tasks.json', 'utf8')
			
			if(data){
				this.tasks = JSON.parse(data);
				console.log('Data updated');
			}
		}catch (err) {
			console.err('Error loading file: ', err);
		}
	}
}
