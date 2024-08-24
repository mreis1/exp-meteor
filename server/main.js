import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/api/TasksCollection';



const insertTask = (taskText, user) => TasksCollection.insertAsync({ text: taskText,    userId: user._id,
});

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';


Meteor.startup(async () => {
    console.log(await TasksCollection.find().countAsync());

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
