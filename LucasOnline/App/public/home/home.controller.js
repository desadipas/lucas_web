// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function (undefined) {

    'use strict';

    angular.module('app').controller('homeController', homeController);

    homeController.$inject = ['$scope', '$rootScope', 'configService', '$state'];

    function homeController($scope, $rootScope, configService, $state) {
        var vm = this;

        vm.TotalesSimulacion = {
            nPrestamoCuota: 0.00,
            nInteresCuota: 0.00,
            nPagoTotal: 0.00,
            nTasa: 10.00,
            nMontoDeCuota: 0.00
        };

        vm.ParametrosSimulacion = {
            nPrestamo: 1500,
            nCuotas: 12,
            tcea: 10.00,
            tem: 10.00,
            nMontoCuota: 0.0,
            seguroDesgravamen: 0.00245
        };

        vm.ArrayFechasCalendario = [];
        vm.ArrayPruebalist = [];
        vm.CalendarioGenList;

        vm.CalcularCalendario = CalcularCalendario;

        init();

        function init() {
            if (configService.getLogin()) return $state.go('dashboard');
            configService.setMenus(true);
            CalcularCalendario();
        }

        $scope.SliderPrestamo = {
            value: vm.ParametrosSimulacion.nPrestamo,
            options: {
                ceil: 3500,
                floor: 250,
                step: 50,
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
                }
            }
        }

        $scope.SliderCuotas = {
            value: vm.ParametrosSimulacion.nCuotas,
            options: {
                ceil: 18,
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
                }
            }
        }

        var CalendarioListTempPruebaArr = [{
            nIndex: 0, dFechaVencimiento: null, nNroCuota: 0, nMontoCuota: null,
            nInteres: null,
            nCapital: null,
            nSaldo: null,
            nDegravamen: null
        }];

        var CalendarioGeneradoArray = [];


        function CalcularCalendario() {
            var valor = false;
            var dFechaDesembolso = new Date();
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
            var tasaCOm = vm.TotalesSimulacion.nTasa;
            var nCuotas = parseInt(vm.ParametrosSimulacion.nCuotas);
            var day = 30;

            if (!valor) {
                vm.ArrayFechasCalendario = ArrayFechas(dFechaDesembolso, nPrestamo, nCuotas, day);
                var AFechasCalendario = CalendarioFechasCuotaFija(dFechaDesembolso, day, nCuotas);
            }


            var cont = 0;
            var nInteres = 0.00;
            var nGastoss = 14.00;
            var nMontoCuota = Math.round(parseFloat(CuotaFechaFijas(dFechaDesembolso, vm.ParametrosSimulacion.tem, nCuotas, nPrestamo, vm.ArrayFechasCalendario)).toFixed(2) * 100.00) / 100.00;
            vm.TotalesSimulacion.nMontoDeCuota = nMontoCuota;
            var arrays;
            var MontoCuotaReturn = 0.00;
            var nMontoNegativo = 0.00;
            var nMontoDiferenciaNeto = 0.00;
            var nPendIntComp = 0.00;
            var nPendComision = 0.00;
            var nMontoComisionCalculado = 0.00;
            var nMontoNetoICCOM = 0.00;
            var pnMontoComision = 0.00;
            var con;


            do {
                CalendarioListTempPruebaArr = [{}];
                nMonto = nPrestamo;
                nMontoCuotaBK = nMontoCuota;
                dFecha = dFechaDesembolso;

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
                    nInteres = Math.round(parseFloat(nInteres * nMonto) * 100.00) / 100.00;
                    CalendarioListTempPruebaArr[i].nInteres = nInteres;
                    CalendarioListTempPruebaArr[i].nGastos = nGastoss;

                    if (i == 1) {
                        CalendarioListTempPruebaArr[i].nDegravamen = Math.round(parseFloat(vm.ParametrosSimulacion.seguroDesgravamen * nPrestamo).toFixed(2) * 100.00) / 100.00;
                    } else {
                        CalendarioListTempPruebaArr[i].nDegravamen = Math.round(parseFloat(CalendarioListTempPruebaArr[i - 1].nSaldo * vm.ParametrosSimulacion.seguroDesgravamen).toFixed(2) * 100.00) / 100.00;
                    }

                    if (i != nCuotas) {
                        CalendarioListTempPruebaArr[i].nCapital = Math.round((nMontoCuota - parseFloat(CalendarioListTempPruebaArr[i].nInteres)) * 100.00) / 100.00;
                    }
                    else {
                        if (i == 1) {
                            CalendarioListTempPruebaArr[i].nCapital = Math.round(parseFloat(nMonto) * 100.00) / 100.00;
                        }
                        else {
                            CalendarioListTempPruebaArr[i].nCapital = Math.round(parseFloat(CalendarioListTempPruebaArr[i - 1].nSaldo) * 100.00) / 100.00;
                        }
                    }

                    CalendarioListTempPruebaArr[i].nMontoCuota = Math.round((parseFloat(CalendarioListTempPruebaArr[i].nCapital) + parseFloat(CalendarioListTempPruebaArr[i].nInteres) + parseFloat(CalendarioListTempPruebaArr[i].nDegravamen)) * 100.00) / 100.00;
                    nMonto = Math.round((parseFloat(nMonto) - parseFloat(CalendarioListTempPruebaArr[i].nCapital)) * 100.00) / 100.00;
                    CalendarioListTempPruebaArr[i].nSaldo = Math.round(nMonto * 100.00) / 100.00;
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

                    if (parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= -0.01 &&
                        parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) <= 0.0) {
                        MontoCuotaReturn = parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital);
                        bOK = true;
                    }
                    else {
                        if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 250) {
                            nValorInc = 0.3;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 210) {
                            nValorInc = 0.28;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 180) {
                            nValorInc = 0.27;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 120) {
                            nValorInc = 0.26;
                        } else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 100) {
                            nValorInc = 0.25;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 90) {
                            nValorInc = 0.24;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 80) {
                            nValorInc = 0.23;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 75) {
                            nValorInc = 0.22;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 70) {
                            nValorInc = 0.21;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 69) {
                            nValorInc = 0.2;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 68) {
                            nValorInc = 0.19;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 67) {
                            nValorInc = 0.18;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 65) {
                            nValorInc = 0.17;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 60) {
                            nValorInc = 0.16;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 50) {
                            nValorInc = 0.15;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 40) {
                            nValorInc = 0.14;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 30) {
                            nValorInc = 0.13;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 20) {
                            nValorInc = 0.12;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 10) {
                            nValorInc = 0.11;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 5) {
                            nValorInc = 0.1;
                        }
                        else if (Math.abs(parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital)) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) >= 1) {
                            nValorInc = 0.01;
                        }
                        else {
                            nValorInc = 0.01;
                        }

                        if (parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) <= -0.01) {
                            nMontoCuota = Math.round(parseFloat(nMontoCuota - nValorInc) * 100.00) / 100.00;
                        }
                        else if (parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) > 0.0) {
                            nMontoCuota = Math.round(parseFloat(nMontoCuota + nValorInc) * 100.00) / 100.00;
                        }

                        cont += 1;
                        if (cont > 2200) {
                            if (parseFloat(CalendarioListTempPruebaArr[ultimaFila].nCapital) - parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital) < 0 || cont == 1502) {
                                MontoCuotaReturn = parseFloat(CalendarioListTempPruebaArr[ultimaFila - 1].nCapital);
                                bOK = true;
                            }
                        }
                    }
                }
                else {
                    MontoCuotaReturn = parseFloat(CalendarioListTempPruebaArr[0].nCapital);
                    bOK = true;
                }
            } while (!bOK);

            CalendarioGeneradoArray =
            [{
                nIndex: 0, dFechaVencimiento: null, nNroCuota: 0, nMontoCuota: null,
                nInteres: null,
                nCapital: null,
                nSaldo: null
            }];
            vm.CalendarioGenList = RetornoListaCalendarioProgramado(CalendarioListTempPruebaArr);
            //vm.TotalesSimulacion.nPrestamoCuota = Math.round((SumaTotalMontoPrestamo(vm.CalendarioGenList)) * 100.00) / 100.00;
            //vm.TotalesSimulacion.nInteresCuota = Math.round((SumaTotalInteres(vm.CalendarioGenList)) * 100.00) / 100.00;
            //vm.TotalesSimulacion.nPagoTotal = Math.round((vm.TotalesSimulacion.nPrestamoCuota + vm.TotalesSimulacion.nInteresCuota) * 100.00) / 100.00;
            vm.TotalesSimulacion.nMontoCuota = Math.round(Math.round((ObtenerMontoCuota(vm.CalendarioGenList)) * 100.00) / 100.00) + ".00";
            vm.ParametrosSimulacion.nMontoCuota = vm.TotalesSimulacion.nMontoCuota;
            return vm.CalendarioGenList;
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

        function SumaTotalMontoPrestamo(CalendarioGenList) {
            var nSumaTotalPrestamo = 0.00;

            for (var i = 0; i < CalendarioGenList.length; i++) {
                nSumaTotalPrestamo += CalendarioGenList[i].nCapital;
            }
            return nSumaTotalPrestamo;
        }

        function SumaTotalInteres(CalendarioGenList) {
            var nSumaTotalInteres = 0.00;

            for (var i = 0; i < CalendarioGenList.length; i++) {
                nSumaTotalInteres += CalendarioGenList[i].nInteres;
            }
            return nSumaTotalInteres;
        }

        function ObtenerMontoCuota(CalendarioGenList) {
            var nSumaMontoCuota = 0.00;

            for (var i = 0; i < CalendarioGenList.length; i++) {
                nSumaMontoCuota += CalendarioGenList[i].nMontoCuota;
            }
            nSumaMontoCuota = nSumaMontoCuota / CalendarioGenList.length;
            console.log(CalendarioGenList);
            return nSumaMontoCuota;
        }

        function CalendarioFechasCuotaFija(dFechaDesembolso, nDias, nCuota) {
            CalendarioFechas = [];
            var CalendarioFechas = [{}];

            var dFecha = dFechaDesembolso;
            for (var i = 1; i <= nCuota; i++) {
                CalendarioFechas.push({ nId: i });
                var dateFecha = new Date(dFecha);
                var NuevaFecha = new Date(dateFecha);
                NuevaFecha.setDate(NuevaFecha.getDate() + nDias);
                CalendarioFechas[i].nId = i;
                CalendarioFechas[i].dFechaProgamada = getDateFormat(NuevaFecha);
                dFecha = NuevaFecha;
            }
            return CalendarioFechas;
        }

        function ArrayFechas(dFechaDesembolso, nPrestamo, nCuota, nDias) {
            vm.ArrayPruebalist = [];
            var arr = new Array();
            var arrayFechas1 = [nCuota, 2];

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
                var NuevaFecha = new Date(dateFecha);
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
            console.log('------');
            console.log(vm.ArrayPruebalist);
            return vm.ArrayPruebalist;
        }

        function CuotaFechaFijas(fechaDesembolso, pTasaComp, nCuotas, nPrestamo, lstFechas) {

            var nTasaDiaria;
            var pnTasaSeguro = 0.245;
            var nMontoAcumulado = 0.0;
            var nMontoTotalAcumulado = 0.0;
            var nSumaTotal = 0.0;
            var dateFecDes = new Date(fechaDesembolso);
            // calcular la tasa compuesta
            pTasaComp = pTasaComp * (1 + (pnTasaSeguro / 100));

            pTasaComp = parseFloat(Math.round(pTasaComp).toFixed(2));

            /// calcular la tasa diaria 
            nTasaDiaria = (Math.pow((1 + (pTasaComp / 100.00)), (1 / 30.00)) - 1) * 100.00;

            for (var i = 0; i <= nCuotas - 1; i++) {

                var dFecha = lstFechas[i];
                var dFechaCalen = new Date(getdate1(dFecha.fechaProgr));
                var nDias = DiferenciaDias(dateFecDes, dFechaCalen);
                var nValorActual = Math.pow((1 / (1 + (nTasaDiaria / 100))), (nDias));

                nSumaTotal += nValorActual;
            }

            nMontoAcumulado = nPrestamo / nSumaTotal;
            nMontoTotalAcumulado = parseFloat(nMontoAcumulado);

            return nMontoTotalAcumulado;
        }

        var numberWithCommas = function (x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

    }

})();