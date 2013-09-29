define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/tasks.html',
    'Organization/Apps/Tasks/NormalThumbnail/Views/Main'
], function ($, _, Backbone, tasks_template, TaskNormalThumbnail) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadlines_show_tasks",
        initialize: function (deadline) {
            var base = this;
            base.deadline = deadline;
            base.model = deadline;
            base.current_page = 1;
            base.page_size = 3;
        },
        init: function (draggable_tasks) {
            var base = this;

            base.draggable_tasks = draggable_tasks;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(tasks_template, {});
            base.$el.html(template);


            base.renderPage(1);
        },
        renderPage: function (page) {
            var base = this;
            if (base.$el.height() > 0) {
                var psize = Math.floor(base.$el.height() * base.$el.width() / 49300);
                if (psize > 0) {
                    base.page_size = psize;
                }
            }
            var tasks = base.deadline.getTasks();

            base.page_count = Math.ceil(tasks.models.length / base.page_size);
            if (page)
                base.current_page = page;
            if (base.current_page < 1) {
                base.current_page = 1;
            } else if (base.current_page > base.page_count) {
                base.current_page = base.page_count;
            }

            var page_begin = (base.current_page - 1) * base.page_size;
            var page_end = page_begin + base.page_size;

            tasks = tasks.slice(page_begin, page_end);

            base.$el.find(".tasks_list").html("");
            for (var k in tasks) {
                var task = tasks[k];
                var task_thumbnail = new TaskNormalThumbnail(task);
                base.$el.find(".tasks_list").append(task_thumbnail.$el);
                task_thumbnail.init(base.draggable_tasks);
            }


            var new_thb = TaskNormalThumbnail.new_tpl;
            base.$el.find(".tasks_list").append(new_thb);
            base.$el.find(".tasks_list").append('<div class="clearer"></div>');

            base.$el.find("> .pagination_container .pagination").html("");
            for (var i = 1; i <= base.page_count; i++) {
                var link = $('<a href="javascript:void(0)" class="page_button' + (i == base.current_page ? ' selected' : '') + '" data-page="' + i + '"><div></div></a>');
                base.$el.find("> .pagination_container .pagination").append(link);

            }

        },
        registerEvents: function () {
            var base = this;

            SmartBlocks.Blocks.Organization.Data.tasks.on('add', function () {
                base.renderPage();
            });

            SmartBlocks.Blocks.Organization.Data.tasks.on('remove', function () {
                base.renderPage();
            });

            base.$el.delegate(".task_normal_thumbnail.new", 'click', function () {
                var task = new SmartBlocks.Blocks.Organization.Models.Task();
                task.set('deadline', base.deadline);
                task.set('activity', base.deadline.getActivity());
                task.set('name', 'New task');
                task.set('required_time', 4);
                task.save({}, {
                    success: function () {
                        SmartBlocks.basics.show_message('Successfully created task');
                        base.renderPage(base.page_count);
                    }
                });
                SmartBlocks.Blocks.Organization.Data.tasks.add(task);

            });

            base.$el.delegate("> .pagination_container .pagination a", 'click', function () {
                var elt = $(this);
                var page = elt.attr('data-page');
                base.renderPage(page);
            });

            SmartBlocks.Shortcuts.add([
                37
            ], function () {
                console.log("left", base.$el.height());
                if (base.$el.height() > 0) {
                    base.renderPage(base.current_page - 1);
                }
            });
            SmartBlocks.Shortcuts.add([
                39
            ], function () {
                console.log("right");
                if (base.$el.height() > 0) {
                    base.renderPage(base.current_page + 1);
                }
            });
        }
    });

    return View;
});