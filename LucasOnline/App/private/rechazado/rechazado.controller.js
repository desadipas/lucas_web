// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict'

    angular.module('app').controller('rechazadoController', rechazadoController);

    rechazadoController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function rechazadoController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;
        vm.ClientePEP = false;
        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getFlujo() == 0) return $state.go('dashboard');
            vm.nIdFlujoMaestro = configService.getFlujo();
            configService.setFlujo(0);

            dataService.getData(apiUrl + '/Flujo/' + vm.nIdFlujoMaestro).then(function (result) {
                if (result.data[0].nClientePEP == 1) {
                    vm.ClientePEP = true;
                }

                ga('send', 'event', 'Formularios', 'registro', 'Rechazado');

            }, function (error) { authenticationService.errorValida(error); });
        }
    }
})();