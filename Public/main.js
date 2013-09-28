define([
    'jquery',
    'underscore',
    'backbone',
    './Apps/Common/Views/OrganizationView'
], function ($, _, Backbone, OrganizationView) {
    var main = {
        init: function () {
            var base = this;
        },
        organization: function () {
            var base = this;
            var view = new OrganizationView();
            SmartBlocks.Methods.render(view.$el);
            base.view.init(base.app);
        }
    };

    return main;
});