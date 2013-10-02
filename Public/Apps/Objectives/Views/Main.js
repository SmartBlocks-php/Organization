define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html',
    './Recap/Recap',
    './Review/Review'
], function ($, _, Backbone, main_template, RecapView, ReviewView) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"objectives_view",
        initialize:function () {
            var base = this;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.subapp = undefined;
            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;

            var template = _.template(main_template, {});
            base.$el.html(template);
        },
        setSubapp:function (subapp) {
            var base = this;
            base.$el.find(".pure-menu-selected").removeClass('pure-menu-selected');
            if (subapp == 'recap') {
                base.subapp = new RecapView();
                base.$el.find(".objectives_subapp_container").html(base.subapp.$el);
                base.subapp.init();
                base.$el.find(".recap").addClass("pure-menu-selected");
            }
            if (subapp == 'review') {
                base.subapp = new ReviewView();
                base.$el.find(".objectives_subapp_container").html(base.subapp.$el);
                base.subapp.init();
                base.$el.find(".review").addClass("pure-menu-selected");
            }
        },
        registerEvents:function () {
            var base = this;

            base.$el.delegate(".recap", "click", function () {
                base.subapp.render();
                base.$el.find(".tasks_preview_container").removeClass("active");
                base.$el.find(".tasks_recap_container").html();
            });
        }
    });

    return View;
});