define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/recap.html',
    'Organization/Apps/Models/Objective',
    'Organization/Apps/Collections/Objectives',
    './../Objective'
], function ($, _, Backbone, recap_template, Objective, ObjectivesCollection, ObjectiveView) {
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
                var objView = new ObjectiveView();
                objView.init(objectives[k]);
                base.$el.find(".objectives_container").append(objView.$el);
            }
        },
        registerEvents:function () {
            var base = this;

            base.$el.delegate(".new_objective_button", "click", function () {
                var new_objective = new Objective();
                SmartBlocks.Blocks.Organization.Data.objectives.add(new_objective);
                new_objective.save({}, {
                    success:function () {
                        console.log("new_objective save", new_objective);
                    }
                });
                var objView = new ObjectiveView();
                objView.init(new_objective);
                base.$el.find(".objectives_container").append(objView.$el);
            });
        }
    });

    return View;
});