define([
    'underscore',
    'backbone',
    'Organization/Apps/Models/PlannedTask'
], function (_, Backbone, PlannedTask) {
    var PlannedTasksCollection = Backbone.Collection.extend({
        url: "/Organization/PlannedTasks",
        model: PlannedTask
    });

    return PlannedTasksCollection;
});