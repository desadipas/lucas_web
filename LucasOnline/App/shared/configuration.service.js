// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').factory('configService', configService);

    function configService() {
        var service = {};
        var AGENCIA = 5;
        var NPROD = 3;
        var NSUBPROD = 9;
        var USER_NAME = '';
        var DOCUMENTO = '';
        var CODIGO_PERSONA = 0;
        var apiUrl = undefined;
        var isLogged = false;
        var mostrarLogout = false;
        var mostrarLenddo = false;
        var flujo = 0;
        var codigoCredito = 0;
        var agenciaCredito = 0;
        var rules = [];
        var menus = false;
        var prestamo = 0;
        var changepass = 1;

        service.setLogin = setLogin;
        service.getLogin = getLogin;

        service.setApiUrl = setApiUrl;
        service.getApiUrl = getApiUrl;

        service.setShowLogin = setShowLogin;
        service.getShowLogin = getShowLogin;

        service.setUserName = setUserName;
        service.getUserName = getUserName;

        service.setPersona = setPersona;
        service.getPersona = getPersona;

        service.setDocumento = setDocumento;
        service.getDocumento = getDocumento;

        //service.setNombres = setNombres;
        //service.getNombres = getNombres;

        service.setFlujo = setFlujo;
        service.getFlujo = getFlujo;

        service.setShowLenddo = setShowLenddo;
        service.getShowLenddo = getShowLenddo;

        service.setCodigoCredito = setCodigoCredito;
        service.getCodigoCredito = getCodigoCredito;

        service.setAgenciaCredito = setAgenciaCredito;
        service.getAgenciaCredito = getAgenciaCredito;
        //---
        service.getAgencia = getAgencia;
        service.setAgencia = setAgencia;

        service.getnPro = getnPro;
        service.setnPro = setnPro;

        service.nSubProd = nSubProd;
        service.setnSubProd = setnSubProd;

        service.setRules = setRules;
        service.getRules = getRules;

        service.setMenus = setMenus;
        service.getMenus = getMenus;

        service.setPrestamo = setPrestamo;
        service.getPrestamo = getPrestamo;

        service.getUrlInicio = getUrlInicio;

        service.getUrlLogin = getUrlLogin;

        service.setChangePass = setChangePass;
        service.getChangePass = getChangePass;

        return service;

        function setChangePass(val) {
            changepass = val;
        }

        function getChangePass() {
            return changepass;
        }

        function getUrlInicio() {
            return URL.INICIO;
        }

        function getUrlLogin() {
            return URL.BASE;
        }

        function setPrestamo(val) {
            prestamo = val;
        }

        function getPrestamo() {
            return prestamo;
        }

        function setMenus(val) {
            menus = val;
        }

        function getMenus() {
            return menus;
        }

        function setRules(val) {
            rules = val;
        }

        function getRules() {
            return rules;
        }

        function setCodigoCredito(val) {
            codigoCredito = val;
        }

        function getCodigoCredito() {
            return codigoCredito;
        }

        function setAgenciaCredito(val) {
            agenciaCredito = val;
        }

        function getAgenciaCredito() {
            return agenciaCredito;
        }

        function getAgencia() { return AGENCIA; }
        function setAgencia(val) { AGENCIA = val };

        function getnPro() { return NPROD; }
        function setnPro(val) { NPROD = val; }

        function nSubProd() { return NSUBPROD; }
        function setnSubProd(val) { NSUBPROD = val; }

        function setLogin(status) {
            isLogged = status;
        }

        function getLogin() {
            return isLogged;
        }

        function setApiUrl(url) {
            apiUrl = url;
        }

        function getApiUrl() {
            return apiUrl;
        }

        function setShowLogin(val) {
            mostrarLogout = val;
        }

        function getShowLogin() {
            return mostrarLogout;
        }

        function setFlujo(val) {
            flujo = val;
        }

        function getFlujo() {
            return flujo;
        }

        function setShowLenddo(val) {
            mostrarLenddo = val;
        }

        function getShowLenddo() {
            return mostrarLenddo;
        }

        function setUserName(val) {
            USER_NAME = val;
        }

        function getUserName() {
            return USER_NAME;
        }

        function setPersona(val) {
            CODIGO_PERSONA = val;
        }

        function getPersona() {
            return CODIGO_PERSONA;
        }

        function setDocumento(val) {
            DOCUMENTO = val;
        }

        function getDocumento() {
            return DOCUMENTO;
        }
    }

})();