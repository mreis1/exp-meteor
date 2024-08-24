import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/tasksMethods';
import {TasksCollection} from "../imports/db/TasksCollection";

const insertTask = (taskText) => Meteor.call('tasks.insert', taskText);

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';


Meteor.startup(async () => {
    const user = await Accounts.findUserByUsername(SEED_USERNAME);

    if (!await Accounts.findUserByUsername(SEED_USERNAME)) {
        await Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        });
    }

    if (await (TasksCollection.find({userId: user.id}).countAsync()) === 0) {
        const ids = await Promise.all([
            'First Task',
            'Second Task',
            'Third Task',
            'Fourth Task',
            'Fifth Task',
            'Sixth Task',
            'Seventh Task'
        ].map((text) =>insertTask(text, user)))
        console.log({
            ids
        })
    }
});
