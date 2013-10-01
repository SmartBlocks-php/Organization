define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/objective.html',
    'Organization/Apps/Models/Objective',
    'ContextMenuView',
    'jqueryui'
], function ($, _, Backbone, objective_template, Objective, ContextMenu) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"objective_item",
        initialize:function () {
            var base = this;
        },
        init:function (objective) {
            var base = this;
            base.objective = objective;
            base.model = objective;
            base.edition = false;
            base.render();
            base.registerEvents();
            base.$el.attr("oncontextmenu", "return false;");
            base.objective.on("change", function (model) {
                base.model = model;
                base.objective = model;
                base.render();
            });

            base.$el.droppable({
                drop:function (event, ui) {
                    console.log("task ID ", ui.draggable.context.attributes.id.value);
                }
            });
        },
        render:function () {
            var base = this;
            var template = _.template(objective_template, {
                objective:base.objective
            });
            base.$el.html(template);
            if (base.objective.get("id") !== undefined) {
                base.$el.attr("data-id", base.objective.get("id"));
            }
        },
        modeEditionOn:function () {
            var base = this;
            base.edition = true;
            base.$el.find(".objective_name_input").val(base.objective.get("name"));
            base.$el.find(".objective_name").addClass("edition");
            base.$el.find(".objective_name_edition").css("display", "block");
        },
        modeEditionOff:function () {
            var base = this;
            base.edition = false;
            var new_name = base.$el.find(".objective_name_input").val();
            base.objective.save({
                    name:new_name
                },
                {
                    success:function () {
                        SmartBlocks.basics.show_message("Successfully update objective.");
                    }
                });
            base.$el.find(".objective_name").html(new_name);
            base.$el.find(".objective_name").removeClass("edition");
            base.$el.find(".objective_name_edition").css("display", "none");
        },
        registerEvents:function () {
            var base = this;
            base.$el.delegate(".objective_name_input", "keydown", function (event) {
                var currentInput = event.target;
                if (event.keyCode == 13) {
                    $(currentInput).focusout();
                    base.modeEditionOff();
                    event.stopPropagation();
                }
            });

            base.$el.mouseup(function (e) {
                if (e.which == 1) {
                    SmartBlocks.events.trigger("objective_mouseup1", base.objective);
                }

                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    if (base.edition) {
                        context_menu.addButton("Validate", function () {
                            base.modeEditionOff();
                        });
                    }
                    else {
                        context_menu.addButton("Edit", function () {
                            base.modeEditionOn();
                        });
                    }

                    context_menu.addButton("Delete", function () {
                        if (confirm("Are you sure you want to delete this objective ?")) {
                            base.$el.remove();
                            SmartBlocks.Blocks.Organization.Data.objectives.remove(base.objective);
                            base.objective.destroy({
                                success:function () {
                                    SmartBlocks.events.trigger("objective_destroy", base.objective);
                                    SmartBlocks.basics.show_message("Successfully deleted objective.");
                                },
                                error:function () {
                                    SmartBlocks.basics.show_message("Couldn't delete objective.");
                                }
                            });
                        }
                    });

                    context_menu.show(e);
                }
            });
        }
    });

    return View;
});