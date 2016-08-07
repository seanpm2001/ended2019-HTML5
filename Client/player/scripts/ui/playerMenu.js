﻿/// <reference path="../../../smartJs/sj.js" />
/// <reference path="../../../smartJs/sj-core.js" />
/// <reference path="../../../smartJs/sj-ui.js" />
/// <reference path="../../../pocketCode/scripts/core.js" />
/// <reference path="../../../pocketCode/scripts/ui.js" />
/// <reference path="../../../pocketCode/scripts/ui/input.js" />
/// <reference path="../../../pocketCode/scripts/ui/menu.js" />
'use strict';

PocketCode.Player.merge({
    
    MenuCommand: {
        LANGUAGE_CHANGE: 2,
        TERMS_OF_USE: 3,
    },

    Ui: {
        Menu: (function () {
            Menu.extends(PocketCode.Ui.Menu, false);

            //cntr
            function Menu(args) {
                PocketCode.Ui.Menu.call(this);

                this._languageRadioGroup = new PocketCode.Ui.RadioGroup();
                this._sep = new PocketCode.Ui.MenuSeparator();
                this.appendChild(this._sep);
                this._btnTerms = new PocketCode.Ui.MenuItem("termsOfUse");
                this.appendChild(this._btnTerms);

                //events
                this._onMenuAction = new SmartJs.Event.Event(this);
                this._btnTerms.onClick.addEventListener(new SmartJs.Event.EventListener(this._onMenuAction.dispatchEvent.bind(this._onMenuAction, { command: PocketCode.Player.MenuCommand.TERMS_OF_USE }), this));
                PocketCode.I18nProvider.onLanguageChange.addEventListener(new SmartJs.Event.EventListener(this._onLanguageChange, this));   //dispatched onLoad too
            }

            //properties
            //Object.defineProperties(Menu.prototype, {
            //});

            //events
            Object.defineProperties(Menu.prototype, {
                onMenuAction: {
                    get: function () {
                        return this._onMenuAction;
                    }
                },
            });

            //methods
            Menu.prototype.merge({
                _onLanguageChange: function (e) {
                    var currentLang = e.language;

                    if (this._languageRadioGroup.radios.length == 0) {  //ui buttons not created
                        var langs = PocketCode.I18nProvider.supportedLanguages;

                    }
                    //for each: this._insertBefore(*new*, this._sep);
                    //TODO: rebuilt language menu items or change 
                },
                addToDom: function (domElement) {
                    domElement = domElement || document.body;
                    domElement.appendChild(this._dom);
                },
                //dispose: function () {
                //    PocketCode.I18nProvider.onLanguageChange.removeEventListener(new SmartJs.Event.EventListener(this._onLanguageChange, this));
                //    PocketCode.Ui.Menu.prototype.dispose.call(this);    //call super
                //}
            });

            return Menu;
        })(),
    },
});

