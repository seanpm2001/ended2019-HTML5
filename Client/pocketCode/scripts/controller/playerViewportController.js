﻿/// <reference path="../core.js" />
/// <reference path="../view/programViewportView.js" />
'use strict';

PocketCode.PlayerViewportController = (function () {
    PlayerViewportController.extends(PocketCode.BaseController, false);

    function PlayerViewportController() {
        PocketCode.BaseController.call(this, new PocketCode.Ui.PlayerViewportView());
    }

    //events
    Object.defineProperties(PlayerViewportController.prototype, {
    });

    //methods
    PlayerViewportController.prototype.merge({
        load: function (images, sprites) {

        },
        setProgramScreenSize: function (width, height) {
            this.view.setViewportSize(width, height);
        },
        showAxes: function () {
            this.view.showAxes();
        },
        hideAxes: function () {
            this.view.hideAxes();
        },
    });

    return PlayerViewportController;
})();
