// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('firmaElectronicaController', firmaElectronicaController);

    firmaElectronicaController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function firmaElectronicaController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.nIdFlujoMaestro;
        vm.cMovil;
        vm.CodigoVerificador;
        vm.CodigoPermiso;
        vm.bAutoriza;
        vm.ClientePEP = false;
        vm.Flujo = {};
        vm.Credito = {
            nPrestamo: 0,
            nCuotas: 0,
            nMontoCuota: 0,
            nTEM: 0
        };

        vm.nCodAge = 0;
        vm.nCodCred = 0;
        vm.Wizard;

        vm.ContinuarFlujo = ContinuarFlujo;
        vm.enviaCodigo = enviaCodigo;
        vm.MuestraReporte = MuestraReporte;
        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getFlujo() == 0) return $state.go('dashboard');
            vm.nIdFlujoMaestro = configService.getFlujo();
            configService.setFlujo(0);
            datosFlujo();
            Wizard();
        };

        function datosFlujo() {
            dataService.getData(apiUrl + '/Flujo/' + vm.nIdFlujoMaestro).then(function (result) {
                vm.Flujo = result.data[0];
                vm.cMovil = vm.Flujo.cMovil;
                vm.nCodAge = vm.Flujo.nCodAge;
                vm.nCodCred = vm.Flujo.nCodCred;

                if (vm.Flujo.nClientePEP == 1) {
                    vm.ClientePEP = true;
                }

                dataService.getData(apiUrl + '/Credito/DatosPrestamo/' + vm.Flujo.nCodAge + '/' + vm.Flujo.nCodCred).then(function (credito) {
                    vm.Credito.nPrestamo = 'S/ ' + formatoMiles(credito.data[0].nPrestamo);
                    vm.Credito.nMontoCuota = 'S/ ' + formatoMiles(credito.data[0].nMontoCuota);
                    vm.Credito.nCuotas = credito.data[0].nNroCuotas;
                    vm.Credito.nTEM = credito.data[0].nTasaComp + '%';
                }, function (error) { authenticationService.errorValida(error); });
            }, function (error) { authenticationService.errorValida(error); });
        };

        function enviaCodigo() {
            vm.CodigoVerificador = codigoAleatorio();
            var dataSMS = { cMovil: vm.Flujo.cMovil, cTexto: 'Hola SoyLucas, tu código es ' + vm.CodigoVerificador };
            dataService.postData(apiUrl + '/Alerta/SMS', dataSMS).then(function (resultSMS) {
                if (resultSMS.statusText == 'OK') {
                    toastr.success('Mensaje enviado.', 'Datos del préstamo');
                };
            }, function (error) { authenticationService.errorValida(error); });
        };

        function Wizard() {
            dataService.getData(apiUrl + '/Flujo/Wizard/' + vm.nIdFlujoMaestro).then(function (result) {
                vm.Wizard = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function MuestraReporte(tipo) {
            dataService.getData(apiUrl + '/Reporte/' + vm.nCodAge + '/' + vm.nCodCred + '/' + tipo).then(function (result) {
                if (result.statusText == 'OK') {
                    if (result.data.length > 0) {
                        var Nombre = '';
                        if (tipo == 6) { Nombre = 'Solicitud.pdf' }
                        if (tipo == 1) { Nombre = 'Hoja_Resumen_1.pdf' }
                        if (tipo == 2) { Nombre = 'Hoja_Resumen_2.pdf' }
                        if (tipo == 5) { Nombre = 'Contrato.pdf' }
                        if (tipo == 7) { Nombre = 'Seguro.pdf' }
                        if (tipo == 8) { Nombre = 'PEP.pdf' }
                        abrirArchivoPDF(result.data[0].oDocumento, Nombre);
                    } else {
                        toastr.error('Tus documentos no se han generado de forma correcta, por favor comuniquese con nosotros.', 'Solicitud');
                    };
                };
            }, function (error) { authenticationService.errorValida(error); });
        };

        function ContinuarFlujo(val) {
            if (val) {

                if (vm.CodigoVerificador == vm.CodigoPermiso) {

                    bootbox.confirm('¿Desea continuar?', function (message) {
                        if (message) {
                            var dataCredito = {
                                nCodCred: vm.Flujo.nCodCred,
                                nCodAge: vm.Flujo.nCodAge,
                                cMovil: vm.Flujo.cMovil,
                                nFirma: parseInt(vm.CodigoPermiso),
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
                            dataService.postData(apiUrl + '/Credito/Firma', dataCredito).then(function (result) {
                                if (result.statusText == 'OK') {
                                    toastr.success('Registro exitoso!.', 'Datos de préstamo');

                                    dataService.getData(apiUrl + '/Flujo/' + vm.nIdFlujoMaestro).then(function (flujo) {
                                        if (flujo.statusText == 'OK') {

                                            var datosPersona = {
                                                cEmail: configService.getUserName(),
                                                nNroDoc: configService.getDocumento(),
                                                nCodPers: configService.getPersona()
                                            };

                                            dataService.postData(apiUrl + '/Persona/Datos', datosPersona).then(function (persona) {

                                                if (persona.statusText == 'OK') {
                                                    modalCargaLlamar('Te estamos enviando un correo con los documentos...');

                                                    var dataReporte = {
                                                        nCodCred: flujo.data[0].nCodCred,
                                                        nCodAge: flujo.data[0].nCodAge,
                                                        cEmail: persona.data[0].cEmail,
                                                        cNombres: persona.data[0].cNombres,
                                                        nPrestamo: configService.getPrestamo(),
                                                        nPEP: flujo.data[0].nClientePEP
                                                    };

                                                    dataService.postData(apiUrl + '/Reporte/Envio', dataReporte).then(function (reporte) {
                                                        modalCargaCerrar();
                                                        console.log(reporte);
                                                        if (reporte.statusText == 'OK') {
                                                            var cruta = flujo.data[0].cNomform;
                                                            if (!reporte.data.bError) {
                                                                toastr.success('Te hemos enviado un correo con los documentos!', 'Solicitud');
                                                                configService.setFlujo(flujo.data[0].nIdFlujoMaestro);
                                                                $state.go(cruta);
                                                            } else {
                                                                toastr.error('Sucedio un error al generar tus documentos, por favor comuniquese con nosotros.', 'Error');
                                                                configService.setFlujo(flujo.data[0].nIdFlujoMaestro);
                                                                $state.go(cruta);
                                                            };
                                                        };
                                                    }, function (error) { authenticationService.errorValida(error); });
                                                }
                                            }, function (error) { authenticationService.errorValida(error); });
                                        } else {
                                            toastr.error('Error al obtener datos del flujo.', 'Error');
                                        }
                                    }, function (error) { authenticationService.errorValida(error); });
                                };
                            }, function (error) { authenticationService.errorValida(error); });
                        }
                    });
                } else {
                    toastr.warning('Código incorrecto', 'Datos del préstamo');
                };
            } else {
                toastr.warning('Debe completar los datos.', 'Datos del préstamo');
            };
        };
    }

})();