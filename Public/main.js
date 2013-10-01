define([
    'jquery',
    'underscore',
    'backbone',
    './Apps/Common/Views/OrganizationView'
], function ($, _, Backbone, OrganizationView) {
    var main = {
        init: function () {
            var base = this;
            if (SmartBlocks.Blocks.Notifications) {
                setInterval(function () {
                    base.checkReviewTime();
                }, 1000);
            }
        },
        checkReviewTime: function () {
            var base = this;
            console.log("checked for daily review");
            var now = new Date();
            var day = now.getDate();
            var month = now.getMonth() + 1;
            var year = now.getFullYear();
            if (now.getHours() > 16) {
                var identifier = day + "-" + month + "-" + year;
                var notification = SmartBlocks.Blocks.Notifications.Data.notifications.find(function (notification) {
                    return notification.get("organization_data") && notification.get("organization_data").id == identifier;
                });
                if (notification) {
                    SmartBlocks.Blocks.Notifications.Methods.notify(notification);
                } else {
                    var notification = SmartBlocks.Blocks.Notifications.Methods.createNotification({
                        title: "Daily review",
                        type: "information",
                        content: "It is time for you to review your day's tasks and to plan tomorrow.",
                        destination: "#Organization/desk/review",
                        sticky: true,
                        organization_data: {
                            id: identifier,
                            done: false
                        }
                    });
                }
            }
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