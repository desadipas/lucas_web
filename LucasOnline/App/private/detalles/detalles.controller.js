// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('detallesController', detallesController);

    detallesController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function detallesController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.codigoCredito;
        vm.agenciaCredito;
        vm.Credito = {};
        vm.Calendario = {};
        vm.Kardex = {};
        vm.TotalCapital = 0;
        vm.TotalInteres = 0;
        vm.TotalGasto = 0;
        vm.TotalSeguro = 0;
        vm.Total = 0;

        vm.MostrarReporte = MostrarReporte;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getCodigoCredito() == 0 || configService.getAgenciaCredito() == 0) return $state.go('dashboard');
            vm.codigoCredito = configService.getCodigoCredito();
            vm.agenciaCredito = configService.getAgenciaCredito();

            configService.setCodigoCredito(0);
            configService.setAgenciaCredito(0);

            datosPrestamo();
        }

        function datosPrestamo() {
            dataService.getData(apiUrl + '/Credito/DatosPrestamo/' + vm.agenciaCredito + '/' + vm.codigoCredito).then(function (credito) {
                if (credito.statusText == 'OK') {
                    vm.Credito.cNumeroContrato = credito.data[0].cNumeroContrato;
                    vm.Credito.nPrestamo = 'S/ ' + formatoMiles(credito.data[0].nPrestamo);
                    vm.Credito.nMontoCuota = 'S/ ' + formatoMiles(credito.data[0].nMontoCuota);
                    vm.Credito.nCuotas = credito.data[0].nNroCuotas;
                    vm.Credito.nTEM = credito.data[0].nTasaComp + '%';

                    dataService.getData(apiUrl + '/Credito/Calendario/Lista/' + vm.agenciaCredito + '/' + vm.codigoCredito).then(function (calendario) {
                        if (calendario.statusText == 'OK') {
                            vm.Calendario = calendario.data;

                            for (var i = 0; i < vm.Calendario.length; i++) {
                                vm.TotalCapital = vm.TotalCapital + parseFloat(vm.Calendario[i].nCapital);
                                vm.TotalInteres = vm.TotalInteres + parseFloat(vm.Calendario[i].nIntComp);
                                vm.TotalGasto = vm.TotalGasto + parseFloat(vm.Calendario[i].nGasto);
                                vm.TotalSeguro = vm.TotalSeguro + parseFloat(vm.Calendario[i].nSeguro);
                                vm.Total = vm.Total + parseFloat(vm.Calendario[i].nTotal);
                            }
                            vm.TotalCapital = 'S/ ' + formatoMiles((Math.round(vm.TotalCapital * 100) / 100).toFixed(2));
                            vm.TotalInteres = 'S/ ' + formatoMiles((Math.round(vm.TotalInteres * 100) / 100).toFixed(2));
                            vm.TotalGasto = 'S/ ' + formatoMiles((Math.round(vm.TotalGasto * 100) / 100).toFixed(2));
                            vm.TotalSeguro = 'S/ ' + formatoMiles((Math.round(vm.TotalSeguro * 100) / 100).toFixed(2));
                            vm.Total = 'S/ ' + formatoMiles((Math.round(vm.Total * 100) / 100).toFixed(2));

                            dataService.getData(apiUrl + '/Credito/Kardex/Lista/' + vm.agenciaCredito + '/' + vm.codigoCredito).then(function (kardex) {
                                if (kardex.statusText == 'OK') {
                                    vm.Kardex = kardex.data;
                                };
                            }, function (error) { authenticationService.errorValida(error); });
                        };
                    }, function (error) { authenticationService.errorValida(error); });
                };
            }, function (error) { authenticationService.errorValida(error); });
        }

        function MostrarReporte(tipo) {
            dataService.getData(apiUrl + '/Reporte/' + vm.agenciaCredito + '/' + vm.codigoCredito + '/' + tipo).then(function (result) {
                if (result.statusText == 'OK') {
                    if (result.data.length > 0) {
                        var Nombre = '';
                        if (tipo == 6) { Nombre = 'Solicitud.pdf' }
                        if (tipo == 1) { Nombre = 'Hoja_Resumen_1.pdf' }
                        if (tipo == 2) { Nombre = 'Hoja_Resumen_2.pdf' }
                        if (tipo == 5) { Nombre = 'Contrato.pdf' }
                        if (tipo == 7) { Nombre = 'Seguro.pdf' }
                        if (tipo == 8) { Nombre = 'PEP.pdf' }
                        if (tipo == 3) { Nombre = 'Voucher.pdf' }
                        if (tipo == 4) { Nombre = 'EECC.pdf' }
                        abrirArchivoPDF(result.data[0].oDocumento, Nombre);
                    } else {
                        toastr.error('Tus documentos no se han generado de forma correcta, por favor comuniquese con nosotros.', 'Solicitud');
                    };
                };
            }, function (error) { authenticationService.errorValida(error); });
        }
    }

})();