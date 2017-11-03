// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('solicitudController', solicitudController);

    solicitudController.$inject = ['dataService', 'configService', '$state', 'toastr', '$scope', 'authenticationService'];

    function solicitudController(dataService, configService, $state, toastr, $scope, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.registraSolicitud = registraSolicitud;

        vm.Persona = {};
        vm.ParametrosSimulacion = {
            nPrestamo: 0,
            nPrestamoMinimo: 0,
            nCuotas: 0,
            nModoPago: 30,
            tcea: 0,
            tem: 0,
            nMontoCuota: 0,
            nGastoEnvio: 0,
            dFechasistema: '',
            seguroDesgravamen: 0,
            tasaTEA: 0
        }

        vm.TotalesSimulacion = {
            nPrestamoCuota: 0.00,
            nInteresCuota: 0.00,
            nPagoTotal: 0.00,
            nTasa: 5.5,
            nMontoDeCuota: 0.00
        };

        vm.Credito = {
            nPrestamo: 0,
            nNroCuotas: 0,
            nPeriodo: 0,
            nTasa: 0,
            nSeguro: 0,
            nCodPers: 0,
            nCodAge: 0,
            nProd: 0,
            nSubProd: 0,
            nMontoCuota: 0,
            nIdFlujoMaestro: 0,
            nCodPersReg: 0,
            nIdFlujo: 0,
            nOrdenFlujo: 0,
            cFormulario: '',
            dFechaSistema: '',
            nCodUsu: '',
            cUsuReg: '',
            nPEP: 0
        }

        vm.ArrayFechasCalendario = [];
        vm.ArrayPruebalist = [];
        vm.CalendarioGenList;

        vm.Wizard;

        var CalendarioListTempPruebaArr = [{
            nIndex: 0, dFechaVencimiento: null, nNroCuota: 0, nMontoCuota: null,
            nInteres: null,
            nCapital: null,
            nSaldo: null
        }];

        var CalendarioListTempPruebaArr = [{
            nIndex: 0, dFechaVencimiento: null, nNroCuota: 0, nMontoCuota: null,
            nInteres: null,
            nCapital: null,
            nSaldo: null,
            nDegravamen: null
        }]

        var FechaCalendario = {
            nId: 0,
            fechaProgr: null
        }

        var CalendarioGeneradoArray = [];

        vm.nIdFlujoMaestro = 0;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getFlujo() == 0) return $state.go('dashboard');
            vm.nIdFlujoMaestro = configService.getFlujo();
            configService.setFlujo(0);
            DatosSolicitud();
            Wizard();
        }

        function DatosSolicitud() {
            dataService.getData(apiUrl + '/Flujo/' + vm.nIdFlujoMaestro).then(function (result) {
                if (result.statusText == 'OK') {
                    vm.Credito.cFormulario = result.data[0].cNomform;
                    vm.Credito.nIdFlujo = result.data[0].nIdFlujo;
                    vm.Credito.nIdFlujoMaestro = result.data[0].nIdFlujoMaestro;
                    vm.Credito.nOrdenFlujo = result.data[0].nOrdenFlujo;
                    vm.Credito.nPEP = result.data[0].nClientePEP;

                    dataService.getData(apiUrl + '/Flujo/Solicitud/' + vm.nIdFlujoMaestro).then(function (result) {
                        vm.ParametrosSimulacion.nPrestamo = result.data[0].nPrestamoMax;
                        vm.ParametrosSimulacion.nPrestamoMinimo = result.data[0].nPrestamoMinimo;
                        vm.ParametrosSimulacion.nCuotas = result.data[0].nPlazo;
                        vm.ParametrosSimulacion.tem = result.data[0].nTasa;
                        vm.ParametrosSimulacion.dFechasistema = result.data[0].dFechaSistema;
                        vm.ParametrosSimulacion.seguroDesgravamen = (result.data[0].nSeguroDesgravamen / 100.00);
                        vm.Credito.nSeguro = result.data[0].nSeguroDesgravamen;
                        vm.Credito.dFechaSistema = result.data[0].dFechaSistema;

                        $scope.SliderPrestamo = {
                            value: vm.ParametrosSimulacion.nPrestamo,
                            options: {
                                ceil: vm.ParametrosSimulacion.nPrestamo,
                                floor: vm.ParametrosSimulacion.nPrestamoMinimo,
                                step: 1,
                                showSelectionBar: true,
                                onStart: function () {
                                    vm.ParametrosSimulacion.nPrestamo = $scope.SliderPrestamo.value;
                                    CalcularCalendario();
                                },
                                onChange: function () {
                                    vm.ParametrosSimulacion.nPrestamo = $scope.SliderPrestamo.value;
                                    CalcularCalendario();
                                },
                                onEnd: function () {
                                    vm.ParametrosSimulacion.nPrestamo = $scope.SliderPrestamo.value;
                                    CalcularCalendario();
                                }
                            }
                        }

                        $scope.SliderCuotas = {
                            value: vm.ParametrosSimulacion.nCuotas,
                            options: {
                                ceil: vm.ParametrosSimulacion.nCuotas,
                                floor: 3,
                                step: 1,
                                showSelectionBar: true,
                                onStart: function () {
                                    vm.ParametrosSimulacion.nCuotas = $scope.SliderCuotas.value;
                                    CalcularCalendario();
                                },
                                onChange: function () {
                                    vm.ParametrosSimulacion.nCuotas = $scope.SliderCuotas.value;
                                    CalcularCalendario();
                                },
                                onEnd: function () {
                                    vm.ParametrosSimulacion.nCuotas = $scope.SliderCuotas.value;
                                    CalcularCalendario();
                                }
                            }
                        }

                        CalcularCalendario();
                    }, function (error) { authenticationService.errorValida(error); });

                } else {
                    toastr.error('Error al obtener datos del flujo.', 'Error');
                }
            }, function (error) { authenticationService.errorValida(error); });
        }

        function Wizard() {
            dataService.getData(apiUrl + '/Flujo/Wizard/' + vm.nIdFlujoMaestro).then(function (result) {
                vm.Wizard = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function CalcularCalendario() {
            var parts = vm.ParametrosSimulacion.dFechasistema.split('/');
            var mydate = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
            var valor = false;

            var dFechaDesembolso = mydate;
            var dFechaParaCalen = dFechaDesembolso;
            dFechaParaCalen = getDateFormat(dFechaParaCalen);
            var nPrestamo = vm.ParametrosSimulacion.nPrestamo;
            var nMonto = 0.00;
            nMonto = nPrestamo;
            var bOK = false;
            var bOK1 = false;
            var nMontoCuotaBK = 0.00;
            var dFecha = dFechaDesembolso;
            var nCapital = 0.00;
            var nPrestamoC = vm.ParametrosSimulacion.nPrestamo;
            var nValorInc = 0.00;
            var nIGV = 0;
            var pnFinCuotaGracia = 0;
            var pnTipoGracia = 1;
            var tasaCOm = 5.00;
            var nCuotas = parseInt(vm.ParametrosSimulacion.nCuotas);
            var day = 30;

            if (!valor) {
                vm.ArrayFechasCalendario = ArrayFechas(dFechaDesembolso, nPrestamo, nCuotas, day);
                var AFechasCalendario = CalendarioFechasCuotaFija(dFechaDesembolso, day, nCuotas);
            }

            var cont = 0;
            var nInteres = 0.00;
            var tasacambada = Math.round(parseFloat(vm.ParametrosSimulacion.tem).toFixed(2) * 100.00) / 100.00;
            /// TRAE EL MONTO DE CUOTA
            var nMontoCuota = Math.round(parseFloat(CuotaFechaFijas(dFechaDesembolso, vm.ParametrosSimulacion.tem, nCuotas, nPrestamo, vm.ArrayFechasCalendario)).toFixed(2) * 100.00) / 100.00;

            var arrays;
            var MontoCuotaReturn = 0.00;
            var nMontoNegativo = 0.00;
            var nMontoDiferenciaNeto = 0.00;
            var nPendIntComp = 0.00;
            var nPendComision = 0.00;
            var nMontoComisionCalculado = 0.00;
            var nMontoNetoICCOM = 0.00;
            var pnMontoComision = 0.00;


            do {
                CalendarioListTempPruebaArr = [{}];
                nMonto = nPrestamo;//Math.round(nPrestamo * 100.00) / 100.00

                nMontoCuotaBK = nMontoCuota;
                dFecha = dFechaDesembolso;

                var con = 0;

                for (var i = 1; i <= nCuotas ; i++) {
                    nMontoCuota = nMontoCuotaBK;
                    CalendarioListTempPruebaArr.push({ nIndex: i });
                    con = 0;

                    arrays = AFechasCalendario[i];

                    var dFechaProgramacion = getdate1(arrays.dFechaProgamada);

                    var dFechaVencimiento = new Date(dFechaProgramacion);

                    var nDiasTranscurridos = DiferenciaDias2(dFecha, dFechaVencimiento);

                    CalendarioListTempPruebaArr[i].dFechaVencimiento = dFechaVencimiento;

                    CalendarioListTempPruebaArr[i].nNroCuota = i;

                    nInteres = Math.pow((1 + vm.ParametrosSimulacion.tem / 100.00), (nDiasTranscurridos / 30.00)) - 1;

                    nInteres = Math.round((nInteres * nMonto) * 100.00) / 100.00;

                    CalendarioListTempPruebaArr[i].nInteres = parseFloat(nInteres).toFixed(2);

                    CalendarioListTempPruebaArr[i].nGastos = 0;

                    if (i == 1) {
                        CalendarioListTempPruebaArr[i].nDegravamen = Math.round(parseFloat(vm.ParametrosSimulacion.seguroDesgravamen * nPrestamo).toFixed(2) * 100.00) / 100.00;
                    } else {
                        CalendarioListTempPruebaArr[i].nDegravamen = Math.round(parseFloat(CalendarioListTempPruebaArr[i - 1].nSaldo * vm.ParametrosSimulacion.seguroDesgravamen).toFixed(2) * 100.00) / 100.00;
                    }

                    if (i != nCuotas) {
                        CalendarioListTempPruebaArr[i].nCapital = Math.round(parseFloat(nMontoCuota - (parseFloat(CalendarioListTempPruebaArr[i].nInteres) + CalendarioListTempPruebaArr[i].nDegravamen)).toFixed(2) * 100.00) / 100.00;
                    }
                    else {
                        if (i == 1) {
                            CalendarioListTempPruebaArr[i].nCapital = Math.round(nMonto * 100.00) / 100.00;
                        }
                        else {
                            CalendarioListTempPruebaArr[i].nCapital = Math.round(CalendarioListTempPruebaArr[i - 1].nSaldo * 100.00) / 100.00;
                        }
                    }

                    CalendarioListTempPruebaArr[i].nMontoCuota = Math.round((parseFloat(CalendarioListTempPruebaArr[i].nCapital) + parseFloat(CalendarioListTempPruebaArr[i].nInteres) + parseFloat(CalendarioListTempPruebaArr[i].nDegravamen)) * 100.00) / 100.00;

                    nMonto = Math.round((parseFloat(nMonto) - parseFloat(CalendarioListTempPruebaArr[i].nCapital)) * 100.00) / 100.00;

                    CalendarioListTempPruebaArr[i].nSaldo = Math.round(nMonto * 100.00) / 100.00;//nMonto; //Math.round(nMonto * 100) / 100;

                    dFecha = CalendarioListTempPruebaArr[i].dFechaVencimiento;
                }

                var ultimaFila = 0;

                for (var i = 1, len = CalendarioListTempPruebaArr.length; i < len; i++) {
                    if (CalendarioListTempPruebaArr[i].nIndex === nCuotas) {
                        ultimaFila = CalendarioListTempPruebaArr[i].nIndex;
                        break;
                    }
                }

                if (ultimaFila > 1) {
                    if (parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= -0.01 &&
                        parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) <= 0.0) {
                        MontoCuotaReturn = parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota);
                        bOK = true;
                    }
                    else {
                        if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 250) {
                            nValorInc = 0.3;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 210) {
                            nValorInc = 0.28;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 180) {
                            nValorInc = 0.27;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 120) {
                            nValorInc = 0.26;
                        } else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 100) {
                            nValorInc = 0.25;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 90) {
                            nValorInc = 0.24;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 80) {
                            nValorInc = 0.23;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 75) {
                            nValorInc = 0.22;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 70) {
                            nValorInc = 0.21;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 69) {
                            nValorInc = 0.2;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 68) {
                            nValorInc = 0.19;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 67) {
                            nValorInc = 0.18;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 65) {
                            nValorInc = 0.17;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 60) {
                            nValorInc = 0.16;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 50) {
                            nValorInc = 0.15;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 40) {
                            nValorInc = 0.14;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 30) {
                            nValorInc = 0.13;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 20) {
                            nValorInc = 0.12;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 10) {
                            nValorInc = 0.11;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 5) {
                            nValorInc = 0.1;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) >= 1) {
                            nValorInc = 0.01;
                        }
                        else {
                            nValorInc = 0.01;
                        }

                        if (parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) <= -0.01) {
                            nMontoCuota = Math.round(parseFloat(nMontoCuota - nValorInc) * 100.00) / 100.00;
                        }
                        else if (parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) > 0.0) {
                            nMontoCuota = Math.round(parseFloat(nMontoCuota + nValorInc) * 100.00) / 100.00;
                        }

                        cont += 1;
                        if (cont > 1500) // 1500 // 2200
                        {
                            if (parseFloat(CalendarioListTempPruebaArr[ultimaFila].nMontoCuota) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota) < 0 || cont == 1502) //1502
                            {
                                MontoCuotaReturn = parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nMontoCuota);
                                bOK = true;
                            }
                        }
                    }
                }
                else {
                    MontoCuotaReturn = parseFloat(CalendarioListTempPruebaArr[0].nMontoCuota);
                    bOK = true;
                }
            } while (!bOK);

            vm.CalendarioGenList = RetornoListaCalendarioProgramado(CalendarioListTempPruebaArr);
            vm.TotalesSimulacion.nMontoCuota = (Math.round((ObtenerMontoCuota(vm.CalendarioGenList)) * 100.00) / 100.00) + vm.ParametrosSimulacion.nGastoEnvio;
            vm.ParametrosSimulacion.nMontoCuota = vm.TotalesSimulacion.nMontoCuota;
            var nTasaCalcular = vm.ParametrosSimulacion.tem;
            vm.ParametrosSimulacion.tasaTEA = Math.round(((Math.pow((1 + nTasaCalcular / 100), (12 / 1)) - 1) * 100) * 100) / 100;
            
            var calendario = [{ monto: vm.ParametrosSimulacion.nPrestamo * -1, fecha: parts[2] + '-' + parts[1] + '-' + parts[0] }];
            
            for (var i = 0; i < vm.CalendarioGenList.length; i++) {
                var fechaa = YYYYMMDDConvert(vm.CalendarioGenList[i].dFechaVencimiento);
                calendario.push({ monto: vm.CalendarioGenList[i].nMontoCuota, fecha: fechaa });
            }

            vm.ParametrosSimulacion.tcea = calcularTCEA(calendario).toFixed(2);

            return vm.CalendarioGenList;
        }

        function ArrayFechas(dFechaDesembolso, nPrestamo, nCuota, nDias) {
            var arr = new Array();
            var arrayFechas1 = [nCuota, 2];
            //var nDias = 30;
            nCuota = nCuota;
            var dFecha = dFechaDesembolso;
            var objFecha = {
                nId: 0,
                dFechaProgamada: null
            }

            var objFecha1 = [{
                nId: 0,
                dFechaProgamada: null
            }]

            for (var i = 1; i <= nCuota; i++) {
                var dateFecha = new Date(dFecha);
                var fechaP = new Date(dateFecha);
                var NuevaFecha = new Date(dateFecha);
                nDias = 30;
                fechaP.setDate(fechaP.getDate() + nDias);

                for (var j = 0; j < FechaCalendario.length; j++) {
                    if (FechaCalendario[j] == fechaP) {
                        nDias = nDias + 1;
                    }
                }

                if (fechaP.getDay() == 0) {
                    nDias = nDias + 1;
                }

                if (fechaP.getDay() == 6) {
                    nDias = nDias + 2;
                }

                for (var j = 0; j < FechaCalendario.length; j++) {
                    if (FechaCalendario[j] == fechaP) {
                        nDias = nDias + 1;
                    }
                }

                NuevaFecha.setDate(NuevaFecha.getDate() + nDias);
                objFecha.nId = i;
                objFecha.dFechaProgamada = getDateFormat(NuevaFecha);
                arrayFechas1[i, 1] = getDateFormat(NuevaFecha);
                dFecha = NuevaFecha;
                var objs = {
                    id: objFecha.nId,
                    fechaProgr: objFecha.dFechaProgamada
                }
                vm.ArrayPruebalist.push(objs);
            }

            return vm.ArrayPruebalist;
        }

        function CalendarioFechasCuotaFija(dFechaDesembolso, nDias, nCuota) {
            var CalendarioFechas = [{}];
            var dFecha = dFechaDesembolso;
            for (var i = 1; i <= nCuota; i++) {
                CalendarioFechas.push({ nId: i });
                var dateFecha = new Date(dFecha);
                var fechaP = new Date(dateFecha);
                var NuevaFecha = new Date(dateFecha);
                nDias = 30;
                fechaP.setDate(fechaP.getDate() + nDias);

                for (var j = 0; j < FechaCalendario.length; j++) {
                    if (FechaCalendario[j] == fechaP) {
                        nDias = nDias + 1;
                    }
                }

                if (fechaP.getDay() == 0) {
                    nDias = nDias + 1;
                }

                if (fechaP.getDay() == 6) {
                    nDias = nDias + 2;
                }

                for (var j = 0; j < FechaCalendario.length; j++) {
                    if (FechaCalendario[j] == fechaP) {
                        nDias = nDias + 1;
                    }
                }

                NuevaFecha.setDate(NuevaFecha.getDate() + nDias);
                CalendarioFechas[i].nId = i;
                CalendarioFechas[i].dFechaProgamada = getDateFormat(NuevaFecha);
                dFecha = NuevaFecha;
            }
            return CalendarioFechas;//vm.ArrayPruebalist;
        }

        function CuotaFechaFijas(fechaDesembolso, pTasaComp, nCuotas, nPrestamo, lstFechas) {
            var CuotaPeriodoFijo = 0;
            var Pot1 = 0;
            var nTasaComp = 0;
            var nTasaComiTmp = 0;
            var nTasaTmp = 0;

            nTasaTmp = ((Math.pow((1 + (pTasaComp / 100)), (30 / 30))) - 1);
            nTasaComp = parseFloat(nTasaTmp);
            nTasaComiTmp = 0;

            //nTasaTmp = (nTasaTmp * (1 + (0.245 / 100)));

            Pot1 = Math.pow((1 + nTasaTmp), nCuotas);
            CuotaPeriodoFijo = ((Pot1 * nTasaTmp) / (Pot1 - 1)) * nPrestamo;

            CuotaPeriodoFijo = Math.round(parseFloat(CuotaPeriodoFijo) * 100.00) / 100.00

            return CuotaPeriodoFijo;

        }

        function RetornoListaCalendarioProgramado(CalendarioListTempPruebaArr) {
            var Calendario = [{}];
            for (var i = 0; i < CalendarioListTempPruebaArr.length; i++) {
                if (i != 0) {
                    Calendario.push(CalendarioListTempPruebaArr[i]);
                } else {
                    Calendario.splice(0, 1);
                }
            }
            return Calendario;
        }

        function ObtenerMontoCuota(CalendarioGenList) {
            var nSumaMontoCuota = 0.00;

            for (var i = 0; i < CalendarioGenList.length; i++) {
                nSumaMontoCuota += CalendarioGenList[1].nMontoCuota;
            }
            nSumaMontoCuota = nSumaMontoCuota / CalendarioGenList.length;
            return nSumaMontoCuota;
        }

        function registraSolicitud() {
            if (vm.ParametrosSimulacion.nMontoCuota < 50.00) {
                toastr.warning('El monto de cuota debe de ser mayor que S/ 50.00.', 'Solicitud');
            } else {
                bootbox.confirm('¿Desea continuar?', function (message) {
                    if (message) {

                        ga('send', 'event', 'Formularios', 'registro', 'Aprobado');

                        vm.Credito.nPrestamo = vm.ParametrosSimulacion.nPrestamo;
                        vm.Credito.nNroCuotas = vm.ParametrosSimulacion.nCuotas;
                        vm.Credito.nPeriodo = 30,
                        vm.Credito.nTasa = vm.ParametrosSimulacion.tem;
                        vm.Credito.nCodPers = configService.getPersona();
                        vm.Credito.nCodAge = configService.getAgencia();
                        vm.Credito.nProd = configService.getnPro();
                        vm.Credito.nSubProd = configService.nSubProd();
                        vm.Credito.nMontoCuota = vm.ParametrosSimulacion.nMontoCuota;
                        vm.Credito.nCodPersReg = configService.getPersona();
                        vm.Credito.nCodUsu = configService.getUserName();
                        vm.Credito.cUsuReg = configService.getUserName();

                        dataService.postData(apiUrl + '/Credito', vm.Credito).then(function (result) {
                            if (result.statusText == 'OK') {
                                toastr.success('Registro exitoso!', 'Solicitud');

                                dataService.getData(apiUrl + '/Flujo/' + vm.Credito.nIdFlujoMaestro).then(function (flujo) {
                                    if (flujo.statusText == 'OK') {

                                        var cruta = flujo.data[0].cNomform;
                                        configService.setFlujo(vm.Credito.nIdFlujoMaestro);
                                        configService.setPrestamo(vm.ParametrosSimulacion.nPrestamo);
                                        $state.go(cruta);
                                    };
                                }, function (error) { authenticationService.errorValida(error); });
                            };
                        }, function (error) { authenticationService.errorValida(error); });//---> Fin Credito
                    };
                });
            }

        }
    }



})();