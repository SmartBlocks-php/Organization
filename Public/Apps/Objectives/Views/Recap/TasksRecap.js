define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Recap/tasks_recap.html',
    'Organization/Apps/Models/Task',
    './TaskItem'
], function ($, _, Backbone, tasks_recap_template, Task, TaskItemView) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"tasks_recap",
        initialize:function () {
            var base = this;
        },
        init:function (objective) {
            var base = this;
            base.objective = objective;
            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;

            var template = _.template(tasks_recap_template, {});
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;

            base.$el.delegate(".new_task_button", "click", function () {
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