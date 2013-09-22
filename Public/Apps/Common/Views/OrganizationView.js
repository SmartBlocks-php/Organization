define([
    'jquery',
    'underscore',
    'backbone',
    'LoadingScreen',
    'text!Organization/Apps/Common/Templates/organization.html',
    'Organization/Apps/Activities/ActivitiesIndex/Views/MainView',
    'Organization/Apps/Activities/ActivitiesShow/Views/MainView',
    'Organization/Apps/TasksShow/Views/MainView',
    'Organization/Apps/Planning/Views/MainView',
    'Organization/Apps/TasksIndex/Views/MainView',
    'Organization/Apps/ActivityCreation/Views/MainView',
    'Organization/Apps/TaskCreation/Views/MainView',
    'Organization/Apps/Desk/Views/Main',
    'Organization/Apps/Common/Organization'
], function ($, _, Backbone, LoadingScreen, Template, ActivitiesIndexView, ActivitiesShowView, TasksShow, PlanningView, TasksIndex, ActivityCreationView, TaskCreationView, DeskView, CommonMethods) {
        var OrganizationView = Backbone.View.extend({
            tagName: "div",
            className: "organization_view",
            initialize: function () {
                var base = this;
                window.OrgApp = base;
                SmartBlocks.Blocks.Organization.common = CommonMethods;
                SmartBlocks.Blocks.Organization.ForceReturn = undefined;
            },
            goTo: function (url) {
                var base = this;

                if (url) {
                    if (base.ForceReturn) {
                        window.location = base.ForceReturn;
                        base.ForceReturn = undefined;
                    } else {
                        window.location = url;
                    }
                }
            },
            init: function (app) {
                var base = this;
                base.SmartBlocks = SmartBlocks;
                base.render();
                base.registerEvents();
                base.app = app;

                SmartBlocks.Shortcuts.add([
                    17, 18, 80
                ], function () {
                    window.location = "#Organization/planning";
                }, "#Organization");

                SmartBlocks.Shortcuts.add([
                    17,18, 68
                ], function () {
                    window.location = "#Organization/desk";
                }, "#Organization");

                SmartBlocks.Shortcuts.add([
                    17, 18, 65
                ], function () {
                    window.location = "#Organization/activities";
                }, "#Organization");

                SmartBlocks.Shortcuts.add([
                    17, 18, 78
                ], function () {
                    window.location = "#Organization/activities/new";
                }, "#Organization/activities");

                SmartBlocks.Shortcuts.add([
                    17, 18, 90
                ], function () {
                    SmartBlocks.router.back();
                }, "#Organization/activities/new");

                SmartBlocks.Shortcuts.add([
                    17, 18, 39
                ], function () {
                    if (SmartBlocks.Url.params[SmartBlocks.Url.params.length - 1] == "desk" || SmartBlocks.Url.params[SmartBlocks.Url.params.length - 1] == "timeline") {
                        window.location = "#Organization/desk/review";
                    }
                    if (SmartBlocks.Url.params[SmartBlocks.Url.params.length - 1] == "review") {
                        window.location = "#Organization/desk/tomorrow";
                    }

                    if (SmartBlocks.Url.params[SmartBlocks.Url.params.length - 1] == "tomorrow") {
                        window.location = "#Organization/desk/timeline";
                    }
                }, "#Organization/desk");

                SmartBlocks.Shortcuts.add([
                    17, 18, 37
                ], function () {
                    if (SmartBlocks.Url.params[SmartBlocks.Url.params.length - 1] == "desk" || SmartBlocks.Url.params[SmartBlocks.Url.params.length - 1] == "timeline") {
                        window.location = "#Organization/desk/tomorrow";
                    }
                    if (SmartBlocks.Url.params[SmartBlocks.Url.params.length - 1] == "review") {
                        window.location = "#Organization/desk/timeline";
                    }

                    if (SmartBlocks.Url.params[SmartBlocks.Url.params.length - 1] == "tomorrow") {
                        window.location = "#Organization/desk/review";
                    }
                }, "#Organization/desk");


                base.app.initRoutes({
                    desk: function (subapp) {

                        base.launchDesk(subapp || "timeline");
                    },
                    activities_index: function () {
                        base.launchActivitiesIndex();
                    },
                    activity_creation: function () {
                        base.launchActivityCreation();
                    },
                    activity_show: function (id, subpage) {
                        base.launchActivitiesShow(id, subpage);
                    },
                    objectives: function () {
                        base.launchObjectives();
                    },
                    planning: function () {
                        base.launchPlanningView();
                    }
                });

                base.deadlines = new SmartBlocks.Blocks.Organization.Collections.Deadlines();

            },
            render: function () {
                var base = this;
                var template = _.template(Template, {});
                base.$el.html(template);
            },
            registerEvents: function () {
                var base = this;

                base.SmartBlocks.events.on("ws_notification", function (message) {
                    if (message.type == "data_update") {
                        console.log(message);
                        if (message.class == "planned_task") {

                            var planned_task = base.planned_tasks.get(message.object.id);
                            console.log(planned_task);
                            if (planned_task) {
                                planned_task.set(message.object);
                            } else {
                                var planned_task = new SmartBlocks.Blocks.Organization.Models.PlannedTask(message.object);
                                base.planned_tasks.add(planned_task);
                            }
                            console.log(planned_task);
                        }
                    }
                });
            },
            setContent: function (element) {
                var base = this;
                base.$el.find(".sub_app_holder").html(element);
            },
            launchCalendar: function () {
                var base = this;
                base.current_view = new CalendarView();
                base.current_view.init(base.SmartBlocks);
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.month").addClass("selected");
                base.setContent(base.current_view.$el)
            },
            launchWeek: function () {
                var base = this;
                base.current_view = new WeekView();
                base.current_view.init(base.SmartBlocks);
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.week").addClass("selected");
                base.setContent(base.current_view.$el)
            },
            launchPlanning: function () {
                var base = this;
                base.current_view = new DailyView();
                base.current_view.init(base.SmartBlocks);
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.daily").addClass("selected");
                base.setContent(base.current_view.$el);

            },
            launchRecap: function () {
                var base = this;
                base.current_view = new RecapView();
                base.current_view.init(base.SmartBlocks);
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.recap").addClass("selected");
                base.setContent(base.current_view.$el);
            },
            launchActivitiesIndex: function () {
                var base = this;
                base.current_view = new ActivitiesIndexView();
                base.current_view.init(base.SmartBlocks);
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.activities").addClass("selected");
                base.setContent(base.current_view.$el);
            },
            launchTasksBoard: function () {
                var base = this;

                base.current_view = new TasksBoardView();
                base.current_view.init(base.SmartBlocks);
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.tasks").addClass("selected");
                base.setContent(base.current_view.$el);
            },
            launchActivitiesShow: function (id, subpage) {
                var base = this;
                if (!base.current_view || base.current_view.app_name != "activity_show" || id != base.current_view.activity.get('id')) {
                    var activity = SmartBlocks.Blocks.Organization.Data.activities.get(id);
                    if (!activity) {
                        console.log(SmartBlocks);
                        activity = new SmartBlocks.Blocks.Organization.Models.Activity({id: id});
                    }
                    base.current_view = new ActivitiesShowView(activity);
                    base.current_view.init(base.SmartBlocks, subpage);
                    base.$el.find(".control_bar a").removeClass("selected");
                    base.$el.find(".control_bar a.activities").addClass("selected");
                    base.setContent(base.current_view.$el);
                } else {
                    base.current_view.setSubpage(subpage);
                }

            },
            launchTasksShow: function (id, subpage) {
                var base = this;
                var task = base.tasks.get(id);
                base.current_view = new TasksShow(task);
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.tasks").addClass("selected");
                base.setContent(base.current_view.$el);
                base.current_view.init(base.SmartBlocks, subpage);
            },
            launchTasksIndex: function () {
                var base = this;
                base.current_view = new TasksIndex();
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.tasks").addClass("selected");
                base.setContent(base.current_view.$el);
                base.current_view.init(base.SmartBlocks);
            },
            launchPlanningView: function () {
                var base = this;
                base.current_view = new PlanningView();

                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.planning").addClass("selected");
                base.setContent(base.current_view.$el);
                base.current_view.init(base.SmartBlocks);
            },
            launchActivityCreation: function () {
                var base = this;
                base.current_view = new ActivityCreationView();

                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.activities").addClass("selected");
                base.setContent(base.current_view.$el);
                base.current_view.init(base.SmartBlocks);
            },
            launchTaskCreation: function (id) {
                var base = this;
                base.current_view = new TaskCreationView();
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.tasks").addClass("selected");
                base.setContent(base.current_view.$el);
                base.current_view.init(base.SmartBlocks, id);
            },
            launchDesk: function (subapp) {
                var base = this;
                base.current_view = new DeskView();
                base.$el.find(".control_bar a").removeClass("selected");
                base.$el.find(".control_bar a.desk_link").addClass("selected");
                base.setContent(base.current_view.$el);
                base.current_view.init(base.SmartBlocks);
                base.current_view.setSubapp(subapp);
            },
            checkForNotifications: function () {
                var base = this;
                base.task_users.fetch({
                    success: function () {
                        if (base.task_users.models.length > 0) {

                        }
                    }
                });
            },
            launchObjectives: function () {
                var base = this;
                base.setContent("Objectives views");
            }
        });

        return OrganizationView;
    }
)
;