// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('lenddoController', lenddoController);

    lenddoController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function lenddoController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.iniciaPrestamo = iniciaPrestamo;

        vm.URLactual;
        vm.cClienteIDLenddo;
        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            //if (!configService.getShowLenddo()) return $state.go('dashboard');
            //configService.setShowLenddo(false);
            var user = localStorageService.get('userToken');
            configService.setDocumento(user.nNroDoc);
            configService.setUserName(user.userName);
            configService.setPersona(user.nCodPers);

            vm.URLactual = window.location;
            vm.cClienteIDLenddo = vm.URLactual.hash.split('=');
            vm.cClienteIDLenddo = vm.cClienteIDLenddo[1];
        }

        function iniciaPrestamo() {
            var user = localStorageService.get('userToken');
            var datosPersona = { cEmail: configService.getUserName(), nNroDoc: configService.getDocumento(), nCodPers: configService.getPersona() };
            
            dataService.postData(apiUrl + '/Persona/Datos', datosPersona).then(function (result) {
                vm.Persona = result.data[0];
                
                toastr.success('La evaluación a comenzado..', 'Evaluación');
                //EVALUACION
                vm.Persona.cCodZona = vm.Persona.cDepartamento + vm.Persona.cProvincia + vm.Persona.cDistrito + '000000';
                vm.Persona.nTipoDoc = 1;
                vm.Persona.nCodAge = configService.getAgencia();
                vm.Persona.nProd = configService.getnPro();
                vm.Persona.nSubProd = configService.nSubProd();
                vm.Persona.nProducto = 12;
                vm.Persona.nModalidad = 0;
                vm.Persona.cLenddo = vm.cClienteIDLenddo;

                modalCargaLlamar('Estamos evaluando tus datos...');

                dataService.postData(apiUrl + '/Evaluacion', vm.Persona).then(function (resultMotor) {
                    modalCargaCerrar();
                    if (resultMotor.statusText == 'OK') {
                        toastr.success('Evaluación exitosa!', 'Evaluación');
                        var nIdFlujoMaestro = resultMotor.data.nIdFlujoMaestro;
                        if (resultMotor.data.nRechazado == 1) {
                            toastr.info('Lo sentimos, te hemos rechazado en la evaluación!', 'Alerta!');
                            $state.go('rechazado');
                        } else {
                            dataService.getData(apiUrl + '/Flujo/' + nIdFlujoMaestro).then(function (result) {
                                if (result.statusText == 'OK') {
                                    var cruta = result.data[0].cNomform;
                                    configService.setFlujo(nIdFlujoMaestro);
                                    $state.go(cruta);
                                } else {
                                    toastr.error('Error al obtener datos del flujo.', 'Error');
                                }
                            }, function (error) { authenticationService.errorValida(error); });
                        };
                    };
                }, function (error) { authenticationService.errorValida(error); });

            }, function (error) { authenticationService.errorValida(error); });
        }
    }

})();