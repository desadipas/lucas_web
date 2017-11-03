// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('modalidadController', modalidadController);

    modalidadController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function modalidadController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.listaBancos;
        vm.Banco;
        vm.Cuenta;
        vm.nIdFlujoMaestro;
        vm.Flujo = {};
        vm.modalidad = modalidad;
        vm.Wizard;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getFlujo() == 0) return $state.go('dashboard');
            vm.nIdFlujoMaestro = configService.getFlujo();
            configService.setFlujo(0);
            datosFlujo();
            bancos();
            Wizard();
        }

        function datosFlujo() {
            dataService.getData(apiUrl + '/Flujo/' + vm.nIdFlujoMaestro).then(function (result) {
                vm.Flujo = result.data[0];
            }, function (error) { authenticationService.errorValida(error); });
        }

        function Wizard() {
            dataService.getData(apiUrl + '/Flujo/Wizard/' + vm.nIdFlujoMaestro).then(function (result) {
                vm.Wizard = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function bancos() {
            dataService.getData(apiUrl + '/Catalogocodigo/10250').then(function (result) {
                vm.listaBancos = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        }

        function modalidad(valid) {
            var bool = true;
            if (valid) {
                if (vm.Banco == "1" && vm.Cuenta.length < 13) {
                    toastr.warning('La cuenta bancaria debe de tener 13 a 14 dígitos', 'Operación BCP');
                    bool = false;
                } else if (vm.Banco == "1" && vm.Cuenta.length > 14) {
                    toastr.warning('La cuenta bancaria debe de tener 13 a 14 dígitos', 'Operación BCP');
                    bool = false;
                } else if (vm.Banco == "2" && vm.Cuenta.length != 20) {
                    toastr.warning('La cuenta bancaria debe de tener 20 dígitos', 'Operación BBVA');
                    bool = false;
                } else if (vm.Banco == "3" && vm.Cuenta.length != 13) {
                    toastr.warning('La cuenta bancaria debe de tener 13 dígitos', 'Operación Interbank');
                    bool = false;
                }

                if (bool) {
                    bootbox.confirm('¿Desea continuar?', function (message) {
                        if (message) {
                            var credito = {
                                nCodCred: vm.Flujo.nCodCred,
                                nCodAge: vm.Flujo.nCodAge,
                                nTipoDesembolso: 1,
                                nBanco: vm.Banco,
                                cNroCuenta: vm.Cuenta,
                                nIdFlujoMaestro: vm.nIdFlujoMaestro,
                                nProd: vm.Flujo.nProd,
                                nSubProd: vm.Flujo.nSubProd,
                                cFormulario: vm.Flujo.cNomform,
                                cUsuReg: configService.getUserName(),
                                nCodPersReg: configService.getPersona(),
                                nIdFlujo: vm.Flujo.nIdFlujo,
                                nCodPers: configService.getPersona(),
                                nOrdenFlujo: vm.Flujo.nOrdenFlujo
                            };
                            dataService.postData(apiUrl + '/Credito/Modalidad', credito).then(function (result) {
                                if (result.statusText == 'OK') {
                                    toastr.success('Registro exitoso!.', 'Modalidad');

                                    modalCargaLlamar('Estamos generando los documentos del Préstamo Aprobado.');

                                    dataService.getData(apiUrl + '/Flujo/' + vm.nIdFlujoMaestro).then(function (flujo) {
                                        if (flujo.statusText == 'OK') {
                                            var nCodCred = flujo.data[0].nCodCred;
                                            var nCodAge = flujo.data[0].nCodAge;
                                            var nPEP = flujo.data[0].nClientePEP;

                                            dataService.getData(apiUrl + '/Reporte/Generar/' + nCodCred + '/' + nCodAge + '/' + nPEP).then(function (reporte) {
                                                modalCargaCerrar();

                                                if (reporte.statusText == 'OK') {
                                                    var cruta = flujo.data[0].cNomform;
                                                    if (!reporte.data.bError) {
                                                        toastr.success('Reportes Generados!', 'Solicitud');
                                                        configService.setFlujo(flujo.data[0].nIdFlujoMaestro);
                                                        $state.go(cruta);
                                                    } else {
                                                        toastr.error('Sucedio un error al generar tus documentos, por favor comuniquese con nosotros.', 'Error');
                                                        configService.setFlujo(flujo.data[0].nIdFlujoMaestro);
                                                        $state.go(cruta);
                                                    };
                                                };
                                            }, function (error) { authenticationService.errorValida(error); });

                                        } else {
                                            toastr.error('Error al obtener datos del flujo.', 'Error');
                                        }
                                    }, function (error) { authenticationService.errorValida(error); });
                                };
                            }, function (error) { authenticationService.errorValida(error); });
                        };
                    });
                };
            } else {
                toastr.warning('Falta completar datos...', 'Validación');
            };
        };
    };

})();