sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("grcriskassess2.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                // worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href])
                // tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

            this.setModel(new JSONModel({
                accessor1: [],
                accessor2: [],
                recipients: []
            }), "saveModel");

            this.setModel(new JSONModel({
                accessor1: [{
                    accessorId: "1",
                    accessorText: "Accessor 1"
                }, {
                    accessorId: "2",
                    accessorText: "Accessor 2"
                }],
                accessor2: [{
                    accessorId: "1",
                    accessorText: "Accessor 1"
                }, {
                    accessorId: "2",
                    accessorText: "Accessor 2"
                }],
                recipients: [{
                    recipientId: "1",
                    recipientText: "Risk Champion 1"
                }, {
                    recipientId: "2",
                    recipientText: "Risk Champion 2"
                }]
            }), "dropdowns");

        },

        onAfterRendering: function () {
            if(this.getModel("appConfigModel").getData().app === "ApproveApp") {
                this.fragment = sap.ui.xmlfragment("grcriskassess2.view.fragments.RiskAssessmentApprover", this);
            } else {
                this.fragment = sap.ui.xmlfragment("grcriskassess2.view.fragments.RiskAssessment", this);
            }
            this.byId("performRiskAssessPage").addContent(this.fragment);
            this.byId("performRiskAssessmentWizard").goToStep(this.byId("basicPlanDetails"), this);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        onNavBack: function () {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        handleAddAccessor1: function () {
            // open popup
            if (!this.accessorPopup) {
                this.accessorPopup = new sap.m.SelectDialog({
                    title: "Select Accessor 1",
                    confirm: function (oEvent) {
                        var aContexts = oEvent.getParameter("selectedContexts");
                        var mObject = aContexts[0].getObject();
                        var oModel = this.getView().getModel("saveModel");
                        var aData = oModel.getData();
                        aData.accessor1.push({ "accessorText": mObject.accessorText });
                        oModel.setData(aData);
                        oModel.refresh();
                    }.bind(this)
                });
                this.accessorPopup.bindAggregation("items", {
                    path: "dropdowns>/accessor1",
                    template: new sap.m.StandardListItem({
                        title: "{dropdowns>accessorText}"
                    })
                });
                this.getView().addDependent(this.accessorPopup);
            }
            this.accessorPopup.open();
        },

        handleDeleteAccessor1: function (oEvent) {
            var id = oEvent.getParameter("listItem").getBindingContext("saveModel").getPath().split("/");
            var oModel = this.getView().getModel("saveModel");
            var aData = oModel.getData();
            aData.accessor1.splice(id,1);
            oModel.setData(aData);
        },

        handleAddAccessor2: function () {
            // open popup
            if (!this.accessorPopup2) {
                this.accessorPopup2 = new sap.m.SelectDialog({
                    title: "Select Accessor 2",
                    confirm: function (oEvent) {
                        var aContexts = oEvent.getParameter("selectedContexts");
                        var mObject = aContexts[0].getObject();
                        var oModel = this.getView().getModel("saveModel");
                        var aData = oModel.getData();
                        aData.accessor2.push({ "accessorText": mObject.accessorText });
                        oModel.setData(aData);
                        oModel.refresh();
                    }.bind(this)
                });
                this.accessorPopup2.bindAggregation("items", {
                    path: "dropdowns>/accessor2",
                    template: new sap.m.StandardListItem({
                        title: "{dropdowns>accessorText}"
                    })
                });
                this.getView().addDependent(this.accessorPopup2);
            }
            this.accessorPopup2.open();
        },

        handleDeleteAccessor2: function (oEvent) {
            var id = oEvent.getParameter("listItem").getBindingContext("saveModel").getPath().split("/");
            var oModel = this.getView().getModel("saveModel");
            var aData = oModel.getData();
            aData.accessor2.splice(id,1);
            oModel.setData(aData);
        },

        handleAddRecipient: function () {
            // open popup
            if (!this.recipientPopup) {
                this.recipientPopup = new sap.m.SelectDialog({
                    title: "Select Recipients",
                    confirm: function (oEvent) {
                        var aContexts = oEvent.getParameter("selectedContexts");
                        var mObject = aContexts[0].getObject();
                        var oModel = this.getView().getModel("saveModel");
                        var aData = oModel.getData();
                        aData.recipients.push({ "recipientText": mObject.recipientText });
                        oModel.setData(aData);
                        oModel.refresh();
                    }.bind(this)
                });
                this.recipientPopup.bindAggregation("items", {
                    path: "dropdowns>/recipients",
                    template: new sap.m.StandardListItem({
                        title: "{dropdowns>recipientText}"
                    })
                });
                this.getView().addDependent(this.recipientPopup);
            }
            this.recipientPopup.open();
        },

        handleDeleteRecipient: function (oEvent) {
            var id = oEvent.getParameter("listItem").getBindingContext("saveModel").getPath().split("/");
            var oModel = this.getView().getModel("saveModel");
            var aData = oModel.getData();
            aData.recipients.splice(id,1);
            oModel.setData(aData);
        },

        handleSubmitRiskAssess: function () {
            sap.m.MessageBox.success("Risk Plan has been submitted successfully");
            this.goToPrevPage();
        },

        handleApproveRiskAssess: function () {
            sap.m.MessageBox.success("Risk Plan has been Approved  Successfully");
            this.goToPrevPage();
        },

        _showObject: function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/Products".length)
            });
        }
    });
});
