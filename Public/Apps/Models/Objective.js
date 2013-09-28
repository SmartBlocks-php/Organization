define([
    'underscore',
    'backbone',
    'Organization/Apps/Models/Task',
    'Organization/Apps/Collections/Tasks'
], function (_, Backbone, Task, TasksCollection) {
    var Model = Backbone.Model.extend({
        urlRoot:"/Organization/Objectives",
        defaults:{
            name:"New Objective"
        },
        parse:function (response) {
            var tasks_array = response.tasks;
            var tasks = new TasksCollection();
            for (var k in tasks_array) {
                var task = new Task(tasks_array[k]);
                tasks.add(task);
            }
            response.tasks = tasks;

            return response;
        }
    });

    return Model;
});