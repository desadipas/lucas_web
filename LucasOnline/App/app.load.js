(function () {

    'use strict';

    angular.module('app').controller('loadController', loadController);

    loadController.$inject = ['$scope', 'configService', 'authenticationService'];

    function loadController($scope, configService, authenticationService) {
        $scope.init = function (url) {
            configService.setApiUrl(url);
            if (!configService.getLogin()) {
                //window.location = URL.INICIO;
                window.location = URL.BASE + '/Lucas/Index#!/login';
            } else {
                window.location = URL.BASE + '/Lucas/Index#!/dashboard';
            }
        }
    }

})();