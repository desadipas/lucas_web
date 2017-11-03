// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('dashboardController', dashboardController);

    dashboardController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function dashboardController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;
        vm.Persona = {
            cNombres: '',
            cApePat: '',
            cCelular: '',
            cEmail: '',
            dFechaNacimiento: ''
        };

        vm.Credito = {
            nIdFlujoMaestro: 0,
            nCodCred: 0,
            nCodAge: 0,
            cNumeroContrato: '',
            nPrestamo: 0,
            nNroCuotas: 0,
            nMontoCuota: 0,
            cFormulario: '',
            cProducto: '',
            cSubProd: '',
            dFechaRegistro: '',
            bActivo: 0,
            cMoneda: '',
            nEstado: 0,
            cEstado: '',
            nProd: 0,
            nSubProd: 0
        };

        vm.nombreCliente = '';
        vm.cNroDoc = '';
        vm.cComentario = '';
        vm.FlujoCodigo = 0;

        vm.iniciaPrestamo = iniciaPrestamo;
        vm.continuarPrestamo = continuarPrestamo;
        vm.refrecarBandeja = refrecarBandeja;
        vm.eliminarFlujo = eliminarFlujo;
        vm.anularProceso = anularProceso;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            var user = localStorageService.get('userToken');
            configService.setShowLenddo(false);
            vm.nombreCliente = user.cNombres.toUpperCase();
            configService.setDocumento(user.nNroDoc);
            configService.setUserName(user.userName);
            configService.setPersona(user.nCodPers);
            if (configService.getChangePass() == 0) return $state.go('contrasenia');
            listaCredito();
        }

        function refrecarBandeja() {
            var credito = { nCodPers: configService.getPersona(), nPagina: 0, nTamanio: 0, nCodAge: configService.getAgencia() };
            dataService.postData(apiUrl + '/Credito/Bandeja', credito).then(function (result) {
                if (result.statusText == 'OK') {
                    vm.Credito = result.data;
                }
            }, function (error) { authenticationService.errorValida(error); });
        }

        function listaCredito() {
            var credito = { nCodPers: configService.getPersona(), nPagina: 0, nTamanio: 0, nCodAge: configService.getAgencia() };
            dataService.postData(apiUrl + '/Credito/Bandeja', credito).then(function (result) {
                if (result.statusText == 'OK') {
                    vm.Credito = result.data;
                }
            }, function (error) { authenticationService.errorValida(error); });
        }

        function validaPersona() {
            var msj = '';
            var valida = true;

            if (vm.Persona.cNombres == '' || vm.Persona.cNombres == null || vm.Persona.cNombres == undefined) {
                msj = 'Nombres incompletos';
                valida = false;
            } else if (vm.Persona.cApePat == '' || vm.Persona.cApePat == null || vm.Persona.cApePat == undefined) {
                msj = 'Apellido paterno incompleto';
                valida = false;
            } else if (vm.Persona.cApeMat == '' || vm.Persona.cApeMat == null || vm.Persona.cApeMat == undefined) {
                msj = 'Apellido materno incompleto'
                valida = false;
            } else if (vm.Persona.cCelular == '' || vm.Persona.cCelular == null || vm.Persona.cCelular == undefined) {
                msj = 'Celular incompleto';
                valida = false;
            } else if (vm.Persona.cEmail == '' || vm.Persona.cEmail == null || vm.Persona.cEmail == undefined) {
                msj = 'Email incompleto';
                valida = false;
            } else if (vm.Persona.cDepartamento == '0' || vm.Persona.cDepartamento == '' || vm.Persona.cDepartamento == null || vm.Persona.cDepartamento == undefined) {
                msj = 'Falta seleccionar departamento';
                valida = false;
            } else if (vm.Persona.cProvincia == '0' || vm.Persona.cProvincia == '' || vm.Persona.cProvincia == null || vm.Persona.cProvincia == undefined) {
                msj = 'Falta seleccionar provincia';
                valida = false;
            } else if (vm.Persona.cDistrito == '0' || vm.Persona.cDistrito == '' || vm.Persona.cDistrito == null || vm.Persona.cDistrito == undefined) {
                msj = 'Falta seleccionar distrito';
                valida = false;
            } else if (vm.Persona.nDirTipo1 == '' || vm.Persona.nDirTipo1 == '0' || vm.Persona.nDirTipo1 == null || vm.Persona.nDirTipo1 == undefined) {
                msj = 'Falta seleccionar tipo de dirección';
                valida = false;
            }
            else if (vm.Persona.nDirTipo2 == '' || vm.Persona.nDirTipo2 == '0' || vm.Persona.nDirTipo2 == null || vm.Persona.nDirTipo2 == undefined) {
                msj = 'Falta seleccionar Nro o Mz';
                valida = false;
            } else if (vm.Persona.cDirValor1 = '' || vm.Persona.cDirValor1 == null || vm.Persona.cDirValor1 == undefined) {
                msj = 'Dirección incompleto';
                valida = false;
            } else if (vm.Persona.cDirValor2 == '' || vm.Persona.cDirValor2 == null || vm.Persona.cDirValor2 == undefined) {
                msj = 'Falta Nro o Mz incompleto';
                valida = false;
            } else if (vm.Persona.nEstadoCivil == '2' || vm.Persona.nEstadoCivil == 2) {
                if (vm.Persona.cDniConyuge == '' || vm.Persona.cDniConyuge == null || vm.Persona.cDniConyuge == undefined) {
                    msj = 'DNI conyuge incompleto';
                    valida = false;
                } else if (vm.Persona.cNomConyuge == '' || vm.Persona.cNomConyuge == null || vm.Persona.cNomConyuge == undefined) {
                    msj = 'Nombre conyuge incompleto';
                    valida = false;
                } else if (vm.Persona.cApeConyuge == '' || vm.Persona.cApeConyuge == null || vm.Persona.cApeConyuge == undefined) {
                    msj = 'Apellido conyuge incompleto';
                    valida = false;
                }
            }

            if (!valida) {
                console.log(msj);
                toastr.warning(msj + ', actualice sus datos!', 'Solicitar préstamo');
            }

            return valida;
        }

        function iniciaPrestamo() {
            var user = localStorageService.get('userToken');

            dataService.getData(apiUrl + '/Credito/RechazadoPorDia/' + configService.getDocumento()).then(function (rechazadoDia) {
                if (rechazadoDia.statusText == 'OK') {
                    if (rechazadoDia.data == 1) {

                        dataService.getData(apiUrl + '/Credito/CreditoxFlujo/' + configService.getDocumento()).then(function (creditoFlujoResult) {
                            if (creditoFlujoResult.statusText == 'OK') {
                                if (creditoFlujoResult.data == 1) {

                                    var datosPersona = { cEmail: configService.getUserName(), nNroDoc: configService.getDocumento(), nCodPers: configService.getPersona() };
                                    dataService.postData(apiUrl + '/Persona/Datos', datosPersona).then(function (result) {
                                        vm.Persona = result.data[0];

                                        if (validaPersona()) {

                                            var dataEvaluacion = { nNroDoc: configService.getDocumento(), nProducto: 12, nModalidad: 0 };
                                            dataService.postData(apiUrl + '/Evaluacion/PreEvaluacion', dataEvaluacion).then(function (resultEvaluacion) {

                                                if (resultEvaluacion.statusText == 'OK') {
                                                    var splited = resultEvaluacion.data.cResultado.split('|');

                                                    if (splited[1] == 'BANCARIZADO') {
                                                        motor();
                                                    } else {
                                                        if (vm.Persona.nTipoEmp == 1 && vm.Persona.nSitLab == 1) {
                                                            motor();
                                                        } else {
                                                            var obj = document.getElementById('VERIFI_ME');
                                                            obj.click();
                                                            configService.setShowLenddo(true);
                                                            toastr.info('Te llevaremos a otra ventana donde registraras tus redes sociales, email y celular..', 'Evaluación');
                                                        }
                                                    }
                                                };
                                            }, function (error) { authenticationService.errorValida(error); });
                                        }
                                    }, function (error) { authenticationService.errorValida(error); });
                                } else {
                                    toastr.warning('Ya tienes un préstamo en proceso!', 'Soy Lucas');
                                }
                            }
                        }, function (error) { authenticationService.errorValida(error); });

                    } else {
                        toastr.warning('Te hemos evaluado y has sido rechazado, por favor intentalo nuevamente mañana.', 'Soy Lucas');
                    }
                }
            }, function (error) { authenticationService.errorValida(error); });
        }

        function motor() {
            toastr.success('La evaluación a comenzado..', 'Evaluación');
            //EVALUACION
            vm.Persona.cCodZona = vm.Persona.cDepartamento + vm.Persona.cProvincia + vm.Persona.cDistrito + '000000';
            vm.Persona.nTipoDoc = 1;
            vm.Persona.nCodAge = configService.getAgencia();
            vm.Persona.nProd = configService.getnPro();
            vm.Persona.nSubProd = configService.nSubProd();
            vm.Persona.nProducto = 12;
            vm.Persona.nModalidad = 0;

            modalCargaLlamar('Estamos evaluando tus datos...');

            dataService.postData(apiUrl + '/Evaluacion', vm.Persona).then(function (resultMotor) {
                if (resultMotor.statusText == 'OK') {
                    modalCargaCerrar();
                    toastr.success('La evaluación a terminado.', 'Evaluación');
                    var nIdFlujoMaestro = resultMotor.data.nIdFlujoMaestro;
                    if (resultMotor.data.nRechazado == 1) {

                        var cMensaje = 'Hola Soy lucas, lamentamos informarte que te hemos rechazado en una evaluación. Puedes volver a intentarlo a unos diás, gracias por confiar en nosotros.';

                        if (resultMotor.data.nPEP == 1) {
                            cMensaje = 'Hola Soy lucas, en esta oportunidad no podemos procesar su solicitud por ser Persona Expuesta Políticamente, gracias por confiar en nosotros.';
                        }

                        var sms = { cMovil: vm.Persona.cCelular, cTexto: cMensaje };
                        dataService.postData(apiUrl + '/Alerta/SMS', sms).then(function (resultSMS) {

                            var cuerpo = emailCuerpo('MALAS NOTICIAS', vm.Persona.cNombres, 'Te hemos rechazado', cMensaje, '', '', '');
                            var email = { cEmail: vm.Persona.cEmail, cTexto: cuerpo, cTitulo: 'Hola SoyLucas, tenemos malas noticias.' };
                            dataService.postData(apiUrl + '/Alerta/Email', email).then(function (resultEMAIL) {

                                toastr.info('Lo sentimos, te hemos rechazado en la evaluación!', 'Alerta!');
                                configService.setFlujo(nIdFlujoMaestro);
                                $state.go('rechazado');
                            }, function (error) { authenticationService.errorValida(error); });
                        }, function (error) { authenticationService.errorValida(error); });
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

                }
            }, function (error) { authenticationService.errorValida(error); });
        }

        function continuarPrestamo(Formulario, IdFlujoMaestro, Estado, credito, agencia, prestamo) {

            if (Estado == 0 || Estado == 1) {
                configService.setFlujo(IdFlujoMaestro);
                configService.setPrestamo(prestamo);
                var Siguiente = Formulario;
                $state.go(Siguiente);
            } else if (Estado == 30 || Estado == 50) {
                configService.setCodigoCredito(credito);
                configService.setAgenciaCredito(agencia);
                $state.go('detalles');
            } else {
                toastr.info('No puede continuar con este flujo.', 'Aviso');
            }
        }

        function eliminarFlujo(flujo, estado) {
            if (estado == 30 || estado == 40 || estado == 50 || escape == 6) {
                toastr.warning('No puede anular este proceso.', 'Anulación de crédito');
            } else {
                vm.FlujoCodigo = flujo;
                $('#modalEliminaFlujo').modal('show');
            };
        }

        function anularProceso() {
            if (vm.cComentario == '') {
                toastr.warning('Debe de escribir porqué motivo fue decisión.', 'Soy Lucas');
            } else {
                bootbox.confirm("¿Desea continuar?", function (message) {
                    if (message) {
                        var data = {
                            nIdFlujoMaestro: vm.FlujoCodigo,
                            cComentario: vm.cComentario,
                            cUsuReg: configService.getUserName()
                        };

                        dataService.postData(apiUrl + '/Flujo/Eliminar', data).then(function (result) {

                            if (result.statusText == 'OK') {
                                $('#modalEliminaFlujo').modal('hide');
                                toastr.success('Se anulo de forma correcta!', 'Anulación de flujo.');
                                listaCredito();
                            }
                        }, function (error) { authenticationService.errorValida(error); });
                    }
                });
            }
        }
    }

})();