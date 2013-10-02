define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Recap/tasks_recap.html',
    'Organization/Apps/Models/Task',
    'Organization/Apps/Collections/Tasks',
    './TaskItem',
    'Organization/Apps/Tasks/NormalThumbnail/Views/Main'
], function ($, _, Backbone, tasks_recap_template, Task, TasksCollection, TaskItemView, TaskNormalThumbnail) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"tasks_recap fullheight",
        initialize:function () {
            var base = this;
        },
        init:function (objective) {
            var base = this;
            base.model = objective;
            base.objective = objective;

            base.objective.on("change", function (model) {
                base.model = model;
                base.objective = model;
                base.render();
            });

            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;

            var template = _.template(tasks_recap_template, {});
            base.$el.html(template);

            var tasks_associated = base.objective.get("tasks").models;
            for (var k in tasks_associated) {
                var taskNormalThumbnailView = new TaskNormalThumbnail(tasks_associated[k]);
                taskNormalThumbnailView.init(false);
                base.$el.find(".tasks_container").append(taskNormalThumbnailView.$el);
            }
        },
        registerEvents:function () {
            var base = this;

            base.$el.delegate(".new_task_button", "click", function () {
                console.log("new_task_button click");
                var new_task = new Task();
                SmartBlocks.Blocks.Organization.Data.tasks.add(new_task);
                new_task.save({}, {
                    success:function () {
                        console.log("new_task save", new_task);
                    }
                });
                var taskItemView = new TaskItemView();
                taskItemView.init(new_task);
                base.$el.find(".tasks_container").append(taskItemView.$el);
            });
        }
    });

    return View;
});