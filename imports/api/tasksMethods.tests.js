import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';

if (Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
            const userId = Random.id();
            let taskId;

            beforeEach(async () => {
                await TasksCollection.removeAsync({});
                taskId = await TasksCollection.removeAsync({
                    text: 'Test Task',
                    createdAt: new Date(),
                    userId,
                });
            });

            it('can delete owned task', async () => {
                mockMethodCall('tasks.remove', taskId, { context: { userId } });

                assert.equal(await TasksCollection.find().countAsync(), 0);
            });
        });
    });
}
