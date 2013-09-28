define([
    'underscore',
    'backbone',
    './ActivityType',
    'Organization/Apps/Models/Task',
    'Organization/Apps/Collections/Tasks'
], function (_, Backbone, ActivityType, Task, TasksCollection) {
    var Activity = Backbone.Model.extend({
        defaults:{
            "model_type":"Activity",
            has_changed:false

        },
        urlRoot:"/Organization/Activities",
        parse:function (response) {

            var type_array = response.type;
            var type = new ActivityType(type_array);
            response.type = type;

            var task_array = response.tasks;
            var collection = new TasksCollection();

            for (var k in task_array) {
                if (!Task) {
                    Task = require('Organization/Apps/Models/Task');
                }
                var task = new Task(task_array[k]);

                collection.add(task);
            }
            response.tasks = collection;


            return response;
        },
        set:function (attributes, options) {
            var base = this;
            var result = Backbone.Model.prototype.set.call(this, attributes, options);
            base.has_changed = true;
            return result;
        },
        save:function (attributes, options) {
            var base = this;
            var result = Backbone.Model.prototype.save.call(this, attributes, options);
            base.has_changed = false;
            return result;
        },
        getDeadlines:function () {
            var base = this;

            var deadlines_array = SmartBlocks.Blocks.Organization.Data.deadlines.filter(function (deadline) {
                if (deadline.get('activity')) {
                    return deadline.get('activity').get('id') == base.get('id');
                }
                else {
                    return false;
                }
            });

            var deadlines = new SmartBlocks.Blocks.Organization.Collections.Deadlines(deadlines_array);
            console.log(deadlines);
            return deadlines;
        },
        getTasks:function () {
            var base = this;

            var tasks_array = SmartBlocks.Blocks.Organization.Data.tasks.filter(function (task) {
                return task.get('activity') != null && task.get('activity').get ? task.get('activity').get('id') == base.get('id') : task.get('activity').id == base.get('id')
            });

            return new SmartBlocks.Blocks.Organization.Collections.Tasks(tasks_array);
        },
        getPlannedTasks:function () {
            var base = this;
            var planned_tasks = new SmartBlocks.Blocks.Organization.Collections.PlannedTasks();

            var tasks = base.getTasks();

            for (var k in tasks.models) {
                var pts = SmartBlocks.Blocks.Organization.Data.planned_tasks.filter(function (pt) {
                    return pt.get('task') && pt.get('task').get('id') == tasks.models[k].get('id')
                });
                for (var i in pts) {
                    planned_tasks.add(pts[i]);
                }
            }
            return planned_tasks;
        }
    });
    return Activity;
});