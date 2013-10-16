define([
    'jquery',
    'underscore',
    'backbone',
    './Apps/Common/Views/OrganizationView'
], function ($, _, Backbone, OrganizationView) {
    var main = {
        init: function () {
            var base = this;

            if (SmartBlocks.current_user.get("connected")) {
                if (SmartBlocks.Blocks.Notifications) {
                    setInterval(function () {
                        base.checkReviewTime();
                    }, 1000);
                }
                SmartBlocks.Shortcuts.add([
                    101
                ], function () {
                    base.notifyReviewTime();
                });
            }
        },
        checkReviewTime: function () {
            var base = this;
            console.log("checked for daily review");
            var now = new Date();
            if (now.getHours() > 16) {
                base.notifyReviewTime();
            }
        },
        notifyReviewTime: function () {
            var base = this;
            var now = new Date();
            var day = now.getDate();
            var month = now.getMonth() + 1;
            var year = now.getFullYear();
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
        },
        launch_organization: function (app) {
            var base = this;
            base.view = new OrganizationView();
            SmartBlocks.Methods.render(base.view.$el);
            base.view.init(app);
        }
    };

    return main;
});