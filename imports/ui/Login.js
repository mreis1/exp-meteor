import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Login.html';
import './Login.css';

Template.login.events({
    async 'submit .login-form'(e) {
        e.preventDefault();

        const target = e.target;

        const username = target.username.value;
        const password = target.password.value;

        const d = await Meteor.loginWithPassword(username, password);
    }
});
