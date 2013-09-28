define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Models/Objective'
], function ($, _, Backbone, Objective) {
    var Collection = Backbone.Collection.extend({
        model:Objective,
        url:"/Organization/Objectives"
    });

    return Collection;
});