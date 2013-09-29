define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Models/PlannedTask',
    'Organization/Apps/Collections/PlannedTasks',
    'ContextMenuView',
    './PlannedTaskPopup',
    'jqueryui',
    'fullCalendar'
], function ($, _, Backbone, PlannedTask, PlannedTasksCollection, ContextMenu, PlannedTaskPopup) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "calendar_container_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.planned_tasks = SmartBlocks.Blocks.Organization.Data.planned_tasks;
            base.parent = parent;
            base.render();
            base.registerEvents();

            base.selected_event = undefined;
        },
        render: function () {
            var base = this;
            base.$el.attr("oncontextmenu", "return false;");
            var now = new Date();
            now.setHours(10);
            var end = new Date();
            end.setHours(11);

            base.events = [];
            for (var k in base.planned_tasks.models) {
                var planned_task = base.planned_tasks.models[k];
                var start = planned_task.getStart();
                var end = new Date(start);
                var duration = parseInt(planned_task.get("duration"));
                end.setTime(end.getTime() + duration);
                var event = {
                    title: planned_task.get("content") ? planned_task.get("content") : "Untitled",
                    start: start,
                    end: end,
                    allDay: false,
                    id: planned_task.get("id"),
                    className: "planned_task_cal pt_event" + planned_task.get('id'),
                    color: "gray"
                };
                base.events.push(event);
            }
            base.$el.html("");
            base.$el.fullCalendar({
                header: {
                    left: '',
                    center: '',
                    right: ''
                },
                height: 650,
                editable: true,
                droppable: true,
                events: base.events,
                defaultView: "agendaWeek",
                allDaySlot: false,
                drop: function (date, allDay, jsEvent, ui) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    if (allDay) {
                        date.setHours(12);
                    }
                    var end = new Date(date);

                    end.setHours(end.getHours() + 1);
                    copiedEventObject.end = end;
                    copiedEventObject.allDay = false;
                    copiedEventObject.editable = true;

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)


                    var planned_task = new PlannedTask();
                    var task = base.parent.tasks.get($(this).attr("id"));
                    planned_task.setStart(date);
                    planned_task.set("duration", 3600000);
                    planned_task.set("content", task.get("name"));
                    planned_task.set("task", task);
                    planned_task.save({}, {
                        success: function () {
                            copiedEventObject.id = planned_task.get("id");
                            copiedEventObject.color = "gray";
                            copiedEventObject.className = "planned_task_cal pt_event" + planned_task.get('id');
                            base.$el.fullCalendar('renderEvent', copiedEventObject);
                            base.planned_tasks.add(planned_task);
                            base.parent.events.trigger("updated_planned_task", planned_task);
                        }
                    });


                },
                eventDrop: function (event, jsEvent, ui, view) {
                    var planned_task = base.planned_tasks.get(event.id);
                    if (planned_task) {
                        planned_task.setStart(event.start);

                        planned_task.save();

                    }

                },
                eventResize: function (event) {
                    var planned_task = base.planned_tasks.get(event.id);

                    if (planned_task) {
                        planned_task.setStart(event.start);
                        planned_task.set("duration", event.end.getTime() - event.start.getTime());


                        planned_task.save({}, {
                            success: function () {
                                base.parent.events.trigger("updated_planned_task");
                            }
                        });

                    }

                },
                eventClick: function (event, e) {
                    var elt = $(this);

                    base.$el.find(".selected_event").removeClass("selected_event");
                    elt.addClass("selected_event");

                    base.selected_pt = SmartBlocks.Blocks.Organization.Data.planned_tasks.get(event.id);
                },
                dayClick: function (date, allDay, jsEvent, view) { // Creation of events on click

                    var end = new Date(date);
                    end.setHours(date.getHours() + 1);
                    var planned_task = new SmartBlocks.Blocks.Organization.Models.PlannedTask();
                    planned_task.setStart(date);
                    planned_task.set("duration", 3600000);
                    planned_task.set("content", "New event");
                    SmartBlocks.Blocks.Organization.Data.planned_tasks.add(planned_task);
                    var newEvent = {
                        title: planned_task.get('content'),
                        start: date,
                        id: "noid",
                        allDay: allDay,
                        end: end,
                        className: "planned_task_cal pt_event" + planned_task.get('id'),
                        color: "rgba(50,50,50,0.3)"
                    };
                    base.$el.fullCalendar('renderEvent', newEvent);
                    planned_task.save();
                },
                eventRender: function (event, element) {
                    var elt = $(element);
                    elt.addClass("planned_task_evt_" + event.id);
                    elt.attr("data-id", event.id);
                    elt.dblclick(function (e) {
                        var elt = $(this);
                        var planned_task = SmartBlocks.Blocks.Organization.Data.planned_tasks.get(elt.attr('data-id'));
                        $(".planned_task_popup").remove();
                        if (planned_task) {
                            var popup = new PlannedTaskPopup(planned_task);
                            popup.init(base.SmartBlocks, e, event);

                            popup.events.on("deleted", function () {
                                base.$el.fullCalendar('removeEvents', event.id)
                                base.parent.events.trigger("updated_planned_task");
                            });
                            popup.events.on("saved", function (event) {
                                base.$el.fullCalendar('updateEvent', event)
                                base.parent.events.trigger("updated_planned_task");
                            });
                        }
                    });
                },
                viewDisplay: function (view) {

                }
            });


        },
        registerEvents: function () {
            var base = this;


            base.$el.delegate(".planned_task_cal", "mousedown", function (e) {

            });


            base.planned_tasks.on("change", function (model) {
                base.updateEvent(model);
                if (base.selected_pt) {
                    if (base.$el.find(".selected_event").length > 1) {
                        base.$el.find(".selected_event").removeClass("selected_event");
                    }
                    base.$el.find(".pt_event" + model.get('id')).addClass("selected_event");
                }
            });

            SmartBlocks.Shortcuts.add([
                46
            ], function () {
                if (base.$el.height() > 0) {
                    if (base.selected_pt) {
                        var id = base.selected_pt.get('id');
                        base.$el.fullCalendar('removeEvents', [id]);
                        base.selected_pt.destroy({
                            success: function () {
                                SmartBlocks.basics.show_message("Successfully deleted event");
                            }
                        });
                    }
                }
            }, "#Organization/planning");

            var move_timer = 0;
            SmartBlocks.Shortcuts.add([
                37
            ], function () {
                if (base.$el.height() > 0) {

                    if (base.selected_pt) {
                        var date = base.selected_pt.getStart();
                        date.setHours(date.getHours() - 24);
                        base.selected_pt.setStart(date);

                        clearTimeout(move_timer);
                        move_timer = setTimeout(function () {
                            base.selected_pt.save();
                        }, 1000);

                    }
                }
            }, "#Organization/planning");

            SmartBlocks.Shortcuts.add([
                39
            ], function () {
                if (base.$el.height() > 0) {
                    if (base.selected_pt) {
                        var date = base.selected_pt.getStart();
                        date.setHours(date.getHours() + 24);
                        base.selected_pt.setStart(date);
                        clearTimeout(move_timer);
                        move_timer = setTimeout(function () {
                            base.selected_pt.save();
                        }, 1000);
                    }
                }
            }, "#Organization/planning");

            SmartBlocks.Shortcuts.add([
                38
            ], function () {
                if (base.$el.height() > 0) {
                    if (base.selected_pt) {
                        var date = base.selected_pt.getStart();
                        date.setMinutes(date.getMinutes() - 30);
                        base.selected_pt.setStart(date);
                        clearTimeout(move_timer);
                        move_timer = setTimeout(function () {
                            base.selected_pt.save();
                        }, 1000);
                    }
                }
            }, "#Organization/planning");

            SmartBlocks.Shortcuts.add([
                40
            ], function () {
                if (base.$el.height() > 0) {
                    if (base.selected_pt) {
                        var date = base.selected_pt.getStart();
                        date.setMinutes(date.getMinutes() + 30);
                        base.selected_pt.setStart(date);
                        clearTimeout(move_timer);
                        move_timer = setTimeout(function () {
                            base.selected_pt.save();
                        }, 1000);
                    }
                }
            }, "#Organization/planning");

            //Duration shortcut
            SmartBlocks.Shortcuts.add([
                16, 40
            ], function () {
                if (base.$el.height() > 0) {
                    if (base.selected_pt) {
                        base.selected_pt.set("duration", base.selected_pt.get("duration") + 30 * 60 * 1000);
                        clearTimeout(move_timer);
                        move_timer = setTimeout(function () {
                            base.selected_pt.save();
                        }, 1000);
                    }
                }
            }, "#Organization/planning");

            SmartBlocks.Shortcuts.add([
                16, 38
            ], function () {
                if (base.$el.height() > 0) {
                    if (base.selected_pt) {
                        base.selected_pt.set("duration", base.selected_pt.get("duration") - 30 * 60 * 1000);
                        clearTimeout(move_timer);
                        move_timer = setTimeout(function () {
                            base.selected_pt.save();
                        }, 1000);
                    }
                }
            }, "#Organization/planning");


        },
        updateEvent: function (model) {
            var base = this;
            var base = this;
            base.$el.fullCalendar('removeEvents', [model.get('id')]);
            base.$el.fullCalendar('removeEvents', ["noid"]);

            var newEvent = {
                title: model.get('content'),
                start: model.getStart(),
                id: model.get("id"),
                allDay: false,
                end: model.getEnd(),
                color: "gray",
                className: "planned_task_cal pt_event" + model.get('id')
            };
            base.$el.fullCalendar('renderEvent', newEvent);


        }
    });

    return View;
});