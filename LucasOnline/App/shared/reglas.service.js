// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\   
(function () {

    'use strict';

    angular.module('app').factory('reglasService', reglasService);

    reglasService.$inject = ['dataService', '$state', 'configService', 'toastr'];

    function reglasService(dataService, $state, configService, toastr) {
        var apiUrl = configService.getApiUrl();
        var reglas = {};
        reglas.recupera = recupera;
        reglas.ejecuta = ejecuta;

        return reglas;

        function recupera(formulario) {
            dataService.getData(apiUrl + '/ReglaNegocio/' + formulario).then(function (result) {
                if (result.statusText == 'OK') {
                    configService.setRules(result.data);
                }
            }, function (error) { console.log(error); });
        }

        function ejecuta() {

        }



    }

})();