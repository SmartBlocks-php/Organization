define([
    'jquery',
    'underscore',
    'backbone',
    'LoadingScreen',
    'text!Organization/Apps/Common/Templates/organization.html',
    'Organization/Apps/Calendar/Views/MainView',
    'Organization/Apps/Tasks/Views/MainView',
    'Organization/Apps/Daily/Views/MainView',
    'Organization/Apps/Recap/Views/MainView',
    'Organization/Apps/Activities/ActivitiesIndex/Views/MainView',
    'Organization/Apps/ActivitiesShow/Views/MainView',
    'Organization/Apps/TasksBoard/Views/MainView',
    'Organization/Apps/TasksShow/Views/MainView',
    'Organization/Apps/Planning/Views/MainView',
    'Organization/Apps/TasksIndex/Views/MainView',
    'Organization/Apps/ActivityCreation/Views/MainView',
    'Organization/Apps/TaskCreation/Views/MainView',
    'Organization/Apps/Desk/Views/Main',
    'Organization/Apps/Common/Collections/TaskUsers',
    'Organization/Apps/Common/Models/Activity',
    'Organization/Apps/Common/Collections/Activities',
    'Organization/Apps/Common/Models/ActivityType',
    'Organization/Apps/Common/Collections/ActivityTypes',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Models/Deadline',
    'Organization/Apps/Collections/Deadlines',
    'Organization/Apps/Daily/Models/PlannedTask',
    'Organization/Apps/Models/Subtask',
    'Organization/Apps/Collections/Subtasks',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'Organization/Apps/Common/Organization'
], function ($, _, Backbone, LoadingScreen, Template, CalendarView, WeekView, DailyView, RecapView, ActivitiesIndexView, ActivitiesShowView, TasksBoardView, TasksShow, PlanningView, TasksIndex, ActivityCreationView, TaskCreationView, DeskView, TaskUsersCollection, Activity, ActivitiesCollection, ActivityType, ActivityTypesCollection, Task, Deadline, DeadlinesCollection, PlannedTask, Subtask, SubtasksCollection, TasksCollection, PlannedTasksCollection, CommonMethods) {
    var OrganizationView = Backbone.View.extend({
        tagName: "div",
        className: "organization_view",
        initialize: function () {
            var base = this;
            base.task_users = new TaskUsersCollection();
            window.OrgApp = base;
            base.common = CommonMethods;

            base.tasks = SmartBlocks.Blocks.Organization.Data.tasks;
            base.planned_tasks = SmartBlocks.Blocks.Organization.Data.planned_tasks;
            base.activities = SmartBlocks.Blocks.Organization.Data.activities;
            base.activity_types = SmartBlocks.Blocks.Organization.Data.activity_types;
            base.events = $.extend({}, Backbone.Events);

            base.Task = SmartBlocks.Blocks.Organization.Models.Task;
            base.PlannedTask = SmartBlocks.Blocks.Organization.Models.PlannedTask;
            base.PlannedTasksCollection = SmartBlocks.Blocks.Organization.Collections.PlannedTasks;
            base.TasksCollection = SmartBlocks.Blocks.Organization.Collections.Tasks;
            base.Deadline = SmartBlocks.Blocks.Organization.Models.Deadline;
            base.DeadlinesCollection = SmartBlocks.Blocks.Organization.Collections.Deadlines;
            base.Subtask = SmartBlocks.Blocks.Organization.Models.Subtask;
            base.SubtasksCollection = SmartBlocks.Blocks.Organization.Collections.Subtasks;
            base.ActivitiesCollection = SmartBlocks.Blocks.Organization.Collections.Activities;
            base.Activity = SmartBlocks.Blocks.Organization.Models.Activity;
            base.ActivityType = SmartBlocks.Blocks.Organization.Models.ActivityType;
            base.ActivityTypesCollection = SmartBlocks.Blocks.Organization.Collections.ActivityTypes;

            base.ForceReturn = undefined;
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
        init: function () {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
            base.registerEvents();

            var Router = Backbone.Router.extend({
                routes: {
                    "week": "week",
                    "month": "month",
                    "daily": "daily",
                    "recap": "recap",
                    "activities/new": "activityCreation",
                    "activities": "activitiesIndex",
                    "activities/:id": "activitiesShow",
                    "activities/:id/:subpage": "activitiesShowSubpage",
                    "tasks/new": "taskCreation",
                    "tasks/new/activity=:id": "taskCreation",
                    "tasks/:id": "tasksShow",
                    "tasks/:id/:subpage": "tasksShowSubpage",
                    "tasks": "tasksIndex",
                    "planning": "planning",
                    'desk': 'desk',
                    'desk/:subapp': 'desk'

                },
                week: function () {
                    base.launchWeek();
                },
                month: function () {
                    base.launchCalendar();
                },
                daily: function () {
                    base.launchPlanning();
                },
                recap: function () {
                    base.launchRecap();
                },
                activitiesIndex: function () {
                    base.launchActivitiesIndex();
                },
                tasksBoard: function () {
                    base.launchTasksBoard();
                },
                activitiesShow: function (id) {
                    base.launchActivitiesShow(id, "summary");
                },
                activitiesShowSubpage: function (id, subpage) {
                    base.launchActivitiesShow(id, subpage);
                },
                tasksShow: function (id) {
                    base.launchTasksShow(id, "summary");
                },
                tasksShowSubpage: function (id, subpage) {
                    base.launchTasksShow(id, subpage);
                },
                planning: function () {
                    base.launchPlanningView();
                },
                tasksIndex: function () {
                    base.launchTasksIndex();
                },
                activityCreation: function () {
                    base.launchActivityCreation();
                },
                taskCreation: function (id) {
                    base.launchTaskCreation(id);
                },
                desk: function (subapp) {
                    if (subapp)
                        base.launchDesk(subapp);
                    else
                        base.launchDesk("timeline");
                }

            });

            base.deadlines = new base.DeadlinesCollection();
            base.launchDesk("timeline");

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
                            var planned_task = new OrgApp.PlannedTask(message.object);
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
                var activity = base.activities.get(id);
                if (!activity) {
                    activity = new Activity({id: id});
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
        }
    });

    return OrganizationView;
});