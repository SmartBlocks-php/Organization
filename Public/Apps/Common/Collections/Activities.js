define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Models/Activity'
], function ($, _, Backbone, Activity) {
    var Collection = Backbone.Collection.extend({
        model: Activity,
        url: "/Organization/Activities"
    });

    return Collection;
});