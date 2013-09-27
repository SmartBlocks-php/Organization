define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    './Calendar',
    './TasksPanel',
    'Organization/Apps/Collections/Tasks',
    'Organization/Apps/Models/Task'
], function ($, _, Backbone, MainViewTemplate, CalendarView, TasksPanel, TasksCollection, Task) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "planning_view",
        initialize: function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.tasks_all = new TasksCollection();

            base.tasks_all.fetch({
                success: function () {

                    base.render();
                    base.update();
                    base.registerEvents();
                }
            });


        },
        render: function () {
            var base = this;

            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);

            var calendar_view = new CalendarView();
            base.$el.find(".calendar_container").html(calendar_view.$el);
            calendar_view.init(base.SmartBlocks, base);
            base.calendar_view = calendar_view;

            base.update();

        },
        update: function () {
            var base = this;
            var date = base.calendar_view.$el.fullCalendar('getDate');

            var view = base.calendar_view.$el.fullCalendar('getView');

            if (view.name == "agendaWeek") {

                var first_date = new Date(date);
                var distance = -first_date.getDay();
                first_date.setDate(date.getDate() + distance);
                var last_date = new Date(date);
                var distance = 6 - last_date.getDay();
                last_date.setDate(date.getDate() + distance);
                var string = "Week days from " + (parseInt(first_date.getMonth()) + 1) + "/" + first_date.getDate() + "/" + first_date.getFullYear();
                string += " to " + (parseInt(last_date.getMonth()) + 1) + "/" + last_date.getDate() + "/" + last_date.getFullYear();
                base.$el.find('.date').html(string);
            }


        },
        registerEvents: function () {
            var base = this;
            base.events.on("updated_planned_task", function (planned_task) {
                base.tasks_all.fetch({
                    success: function () {
                        base.update();
                    }
                });
            });


            base.$el.delegate(".prev_button", "click", function () {
                base.calendar_view.$el.fullCalendar('prev');
                base.update();
            });

            base.$el.delegate(".next_button", "click", function () {
                base.calendar_view.$el.fullCalendar('next');
                base.update();
            });

            base.$el.delegate(".today_button", "click", function () {
                base.calendar_view.$el.fullCalendar('today');
                base.update();
            });

            SmartBlocks.Shortcuts.add([
                17, 37
            ], function () {
                base.calendar_view.$el.fullCalendar('prev');
                base.update();
            }, "#Organization/planning");

            SmartBlocks.Shortcuts.add([
                17, 39
            ], function () {
                base.calendar_view.$el.fullCalendar('next');
                base.update();
            }, "#Organization/planning");
        }
    });

    return View;
});