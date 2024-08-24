import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './App.html';
import "./Task.js";
import "./Login.js";

import {TasksCollection} from "../api/TasksCollection";

const HIDE_COMPLETED_STRING = "hideCompleted";

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();
const getTasksFilter = () => {
    const user = getUser();

    const hideCompletedFilter = { isChecked: { $ne: true } };

    const userFilter = user ? { userId: user._id } : {};

    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    return { userFilter, pendingOnlyFilter };
}




Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();
});
Template.mainContainer.events({
    "click #hide-completed-button"(event, instance) {
        const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
        console.log('click #hide-completed-button', {currentHideCompleted});
        instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
    },
    'click .user'() {
        Meteor.logout();
    }
})
Template.mainContainer.helpers({
    getUser() {
        return getUser();
    },
    incompleteCount() {
        const { pendingOnlyFilter } = getTasksFilter();

        const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
        return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
    },
    tasks() {
        const instance = Template.instance(); // access the bindings
        const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

        const { pendingOnlyFilter, userFilter } = getTasksFilter();

        if (!isUserLogged()) {
            return [];
        }

        return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
            sort: { createdAt: -1 },
        }).fetch();

    },
    hideCompleted() {
        return Template.instance().state.get(HIDE_COMPLETED_STRING);
    },
    isUserLogged() {
        return isUserLogged();
    }
});
Template.mainContainer.events({
    "click #test"(event) {
        alert('Test btn clicked', event);
    },
})
Template.form.events({
    "submit .task-form"(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;

        // Insert a task into the collection
        TasksCollection.insert({
            userId: getUser()._id,
            text,
            createdAt: new Date(), // current time
        });

        // Clear form
        target.text.value = '';
    }
})
