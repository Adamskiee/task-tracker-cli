import { promises as fsPromises } from 'fs';
import fs from 'fs';

export default class Tasks {
	constructor() {
		this.load();
		console.log('Tasks obj created');	
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
		this.save();
		console.log('deleted');
	}
	
	show() {
		let task;
		for (task of this.tasks) {
			console.log(task.name);
		}
	}
	
	
	showTaskBy(status){
		let task;
		for(task of this.tasks){
			if(task.status === status){
				console.log(task.name);
			}
		}
	}

	async save() {
		try {
			await fsPromises.writeFile('tasks.json', JSON.stringify(this.tasks, null, 2), 'utf8');
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
