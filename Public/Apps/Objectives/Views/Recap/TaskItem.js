define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Recap/task_item.html'
], function ($, _, Backbone, task_item_template) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_item",
        initialize:function () {
            var base = this;
        },
        init:function (task) {
            var base = this;
            base.task = task;
            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;

            var template = _.template(task_item_template, {
                task: base.task
            });
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;
        }
    });

    return View;
});