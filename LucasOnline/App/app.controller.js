// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('applicationController', applicationController);

    applicationController.$inject = ['$scope', 'configService','authenticationService'];

    function applicationController($scope, configService, authenticationService) {
        var vm = this;

        vm.validate = validate;
        vm.logout = logout;
        vm.showLogout = showLogout;
        vm.showMenus = showMenus;
        vm.callInicio = callInicio;

        $scope.init = function (url) {
            configService.setApiUrl(url);
            if (!configService.getLogin()) {
                //window.location = URL.BASE + '/Lucas/Index#!/login';
            } else {
                window.location = URL.BASE + '/Lucas/Index#!/dashboard';
            }
        }

        function callInicio() {
            if (!configService.getLogin()) {
                window.location = URL.INICIO;
            }
        }

        function validate() {
            return configService.getLogin();
        }

        function logout() {
            authenticationService.logout();
        }

        function showLogout() {
            return configService.getShowLogin();
        }

        function showMenus() {
            return configService.getMenus();
        }

    }

})();