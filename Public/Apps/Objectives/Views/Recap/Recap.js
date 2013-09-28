define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/recap.html'
], function ($, _, Backbone, recap_template) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"objectives_recap_view fullheight",
        initialize:function () {
            var base = this;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;

            var template = _.template(recap_template, {});
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;
        }
    });

    return View;
});