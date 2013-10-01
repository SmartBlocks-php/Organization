define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Recap/recap.html',
    'Organization/Apps/Models/Objective',
    'Organization/Apps/Collections/Objectives',
    './../ObjectiveItem',
    './TasksRecap',
    'Organization/Apps/Tasks/NormalThumbnail/Views/Main'
], function ($, _, Backbone, recap_template, Objective, ObjectivesCollection, ObjectiveItemView, TasksRecapView, TaskNormalThumbnail) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"objectives_recap_view fullheight",
        initialize:function () {
            var base = this;
        },
        init:function () {
            var base = this;
            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;
            var template = _.template(recap_template, {});
            base.$el.html(template);
            var objectives = SmartBlocks.Blocks.Organization.Data.objectives.models;
            for (var k in objectives) {
                var objView = new ObjectiveItemView();
                objView.init(objectives[k]);
                base.$el.find(".objectives_container").append(objView.$el);
            }


            var tasks = SmartBlocks.Blocks.Organization.Data.tasks.models;
            if (tasks.length > 0) {
                base.$el.find(".tasks_all_box").html();
                for (var k in tasks) {
                    var taskNormalThumbnailView = new TaskNormalThumbnail(tasks[k]);
                    taskNormalThumbnailView.init(true);
                    base.$el.find(".tasks_all_box").append(taskNormalThumbnailView.$el);
                }
            }
            else {
                base.$el.find(".tasks_all_box").html("No tasks found.");
            }
        },
        registerEvents:function () {
            var base = this;

            SmartBlocks.events.on("objective_mouseup1", function (objective) {
                var tasksRecapView = new TasksRecapView();
                tasksRecapView.init(objective);
                base.$el.find(".tasks_recap_container").html(tasksRecapView.$el);
                base.$el.find(".tasks_preview_container").addClass("active");
            });

            SmartBlocks.events.on("objective_destroy", function (objective) {
                base.$el.find(".tasks_preview_container").removeClass("active");
                base.$el.find(".tasks_recap_container").html();
            });

            base.$el.delegate(".new_objective_button", "click", function () {
                var new_objective = new Objective();
                SmartBlocks.Blocks.Organization.Data.objectives.add(new_objective);
                new_objective.save({}, {
                    success:function () {
                        console.log("new_objective save", new_objective);
                    }
                });
                var objView = new ObjectiveItemView();
                objView.init(new_objective);
                base.$el.find(".objectives_container").append(objView.$el);
            });
        }
    });

    return View;
});