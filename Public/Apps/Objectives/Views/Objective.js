define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/objective.html',
    'Organization/Apps/Models/Objective'
], function ($, _, Backbone, objective_template, Objective) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"objective_item",
        initialize:function () {
            var base = this;
        },
        init:function (objective) {
            var base = this;
            base.objective = objective;
            console.log("new objective view", objective);

            base.render();
        },
        render:function () {
            var base = this;

            var template = _.template(objective_template, {
                objective:base.objective
            });
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;
        }
    });

    return View;
});