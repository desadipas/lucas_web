// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('finController', finController);

    finController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function finController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.nIdFlujoMaestro;
        vm.Wizard;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getFlujo() == 0) return $state.go('dashboard');
            vm.nIdFlujoMaestro = configService.getFlujo();
            configService.setFlujo(0);
            Wizard();
        };

        function Wizard() {
            dataService.getData(apiUrl + '/Flujo/Wizard/' + vm.nIdFlujoMaestro).then(function (result) {
                vm.Wizard = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

    }

})();