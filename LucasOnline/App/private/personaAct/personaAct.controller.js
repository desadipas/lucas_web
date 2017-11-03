// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('personaActController', personaActController);

    personaActController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function personaActController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.Persona = {
            cNombres: '',
            cApePat: '',
            cApeMat: '',
            nTipoDoc: '',
            nNroDoc: '',
            cCelular: '',
            cEmail: '',
            cConfirmaEmail: '',
            cCodZona: '',
            cCodZonaEmpleo: '',
            nTipoResidencia: '',
            nSexo: '',
            cTelefono: '',
            dFechaNacimiento: '',
            nEstadoCivil: '',
            nDirTipo1: '',
            nDirTipo2: '',
            nDirTipo3: '',
            cDirValor1: '',
            cDirValor2: '',
            cDirValor3: '',
            nDirTipo1Empleo: '',
            nDirTipo2Empleo: '',
            nDirTipo3Empleo: '',
            cDirValor1Empleo: '',
            cDirValor2Empleo: '',
            cDirValor3Empleo: '',
            nCodAge: '',
            nCUUI: '',
            nSitLab: '',
            nProfes: '',
            nTipoEmp: '',
            cDniConyuge: '',
            cNomConyuge: '',
            cApeConyuge: '',
            cRuc: '',
            nIngresoDeclado: '',
            cDirEmpleo: '',
            cTelfEmpleo: '',
            dFecIngrLab: '',
            bCargoPublico: false,
            cNomEmpresa: '',
            cProfesionOtros: '',
            nEjerceSI: false,
            nEjerceNO: true,
            cDepartamento: '',
            cProvincia: '',
            cDistrito: '',
            cDepartamentoEmpleo: '',
            cProvinciaEmpleo: '',
            cDistritoEmpleo: '',
            nCodPers: 0,
            nCodigoVerificador: 0,
            bAutoriza1: 0,
            bAutoriza2: 0
        };

        vm.TipoDireccionLista;
        vm.TipoDireccionEmpleoLista;
        vm.TipoResidenciaLista;
        vm.EstadoCivilLista;
        vm.SexoList;
        vm.NrooMz = [{ nValor: '4', cNomCod: 'NRO' }, { nValor: '6', cNomCod: 'MZ' }];
        vm.LtoDpto = [{ nValor: '4', cNomCod: "LT" }, { nValor: '6', cNomCod: "DPTO" }];
        vm.NrooMzEmpleo = [{ nValor: '4', cNomCod: 'NRO' }, { nValor: '6', cNomCod: 'MZ' }];
        vm.LtoDptoEmpleo = [{ nValor: '4', cNomCod: "LT" }, { nValor: '6', cNomCod: "DPTO" }];
        vm.ActividadEconomicaLista;
        vm.SituacionLaboralLista;
        vm.ProfesionLista;
        vm.TipoEmpleoList;
        vm.DepartamentoLista;
        vm.ProvinciaLista;
        vm.DistritoLista;
        vm.DepartamentoEmpleoLista;
        vm.ProvinciaEmpleoLista;
        vm.DistritoEmpleoLista;
        vm.mostrarConyuge = false;
        vm.mostrarCampos = true;
        vm.CodigoPermiso;
        vm.CodigoVerificador;

        vm.Provincia = Provincia;
        vm.Distrito = Distrito;
        vm.ProvinciaEmpleo = ProvinciaEmpleo;
        vm.DistritoEmpleo = DistritoEmpleo;
        vm.PersonaActualiza = PersonaActualiza;
        vm.PersonaPermiso = PersonaPermiso;
        vm.PersonaReenviaCodigo = PersonaReenviaCodigo;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getChangePass() == 0) return $state.go('contrasenia');
            TipoDireccion();
            TipoDireccionEmpleo();
            EstadoCivil();
            Sexo();
            TipoResidencia();
            ActividadEconomica();
            SituacionLaboral();
            Profesion();
            TipoEmpleo();
            Departamento();
            DepartamentoEmpleo();
            cargaDatosPersona();
        }

        function cargaDatosPersona() {
            var user = localStorageService.get('userToken');
            var datosPersona = { cEmail: configService.getUserName(), nNroDoc: configService.getDocumento(), nCodPers: configService.getPersona() };
            dataService.postData(apiUrl + '/Persona/Datos', datosPersona).then(function (result) {
                vm.Persona = result.data[0];
                Provincia();
                Distrito();
                ProvinciaEmpleo();
                DistritoEmpleo();
                if (result.data[0].bCargoPublico) {
                    vm.Persona.nEjerceSI = true;
                };
            }, function (error) { authenticationService.errorValida(error); });
        }

        function TipoDireccion() {
            dataService.getData(apiUrl + '/Catalogocodigo/800').then(function (result) {
                vm.TipoDireccionLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function TipoDireccionEmpleo() {
            dataService.getData(apiUrl + '/Catalogocodigo/800').then(function (result) {
                vm.TipoDireccionEmpleoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function EstadoCivil() {
            dataService.getData(apiUrl + '/Catalogocodigo/100').then(function (result) {
                vm.EstadoCivilLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function Sexo() {
            dataService.getData(apiUrl + '/Catalogocodigo/2030').then(function (result) {
                vm.SexoList = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function TipoResidencia() {
            dataService.getData(apiUrl + '/Catalogocodigo/TipoVivienda').then(function (result) {
                vm.TipoResidenciaLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function ActividadEconomica() {
            dataService.getData(apiUrl + '/Catalogocodigo/12025').then(function (result) {
                vm.ActividadEconomicaLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function SituacionLaboral() {
            dataService.getData(apiUrl + '/Catalogocodigo/9910').then(function (result) {
                vm.SituacionLaboralLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function Profesion() {
            dataService.getData(apiUrl + '/Catalogocodigo/5066').then(function (result) {
                vm.ProfesionLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function TipoEmpleo() {
            dataService.getData(apiUrl + '/Catalogocodigo/12027').then(function (result) {
                vm.TipoEmpleoList = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function Departamento() {
            dataService.getData(apiUrl + '/Zona/Departamento').then(function (result) {
                vm.DepartamentoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        };

        function Provincia() {
            dataService.getData(apiUrl + '/Zona/Provincia/' + vm.Persona.cDepartamento).then(function (result) {
                vm.ProvinciaLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function Distrito() {
            dataService.getData(apiUrl + '/Zona/Distrito/' + vm.Persona.cDepartamento + '/' + vm.Persona.cProvincia).then(function (result) {
                vm.DistritoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function DepartamentoEmpleo() {
            dataService.getData(apiUrl + '/Zona/Departamento').then(function (result) {
                vm.DepartamentoEmpleoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function ProvinciaEmpleo() {
            dataService.getData(apiUrl + '/Zona/Provincia/' + vm.Persona.cDepartamentoEmpleo).then(function (result) {
                vm.ProvinciaEmpleoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function DistritoEmpleo() {
            dataService.getData(apiUrl + '/Zona/Distrito/' + vm.Persona.cDepartamentoEmpleo + '/' + vm.Persona.cProvinciaEmpleo).then(function (result) {
                vm.DistritoEmpleoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function PersonaReenviaCodigo() {
            vm.CodigoVerificador = codigoAleatorio();
            var dataSMS = { cMovil: vm.Persona.cCelular, cTexto: 'Hola SoyLucas, tu código es ' + vm.CodigoVerificador };
            dataService.postData(apiUrl + '/Alerta/SMS', dataSMS).then(function (resultSMS) {
                if (resultSMS.statusText == 'OK') {
                    toastr.success('Mensaje enviado.', 'Actualización de datos');
                };
            }, function (error) { authenticationService.errorValida(error); });
        }

        function validarFormulario() {
            var bool = true;
            if (vm.Persona.cDirValor2 == '' || vm.Persona.cDirValor2 == null || vm.Persona.cDirValor2 == undefined) {
                toastr.warning('Falta llenar el campo Nro o Mz.', 'Registro Persona');
                bool = false;
            } else if (vm.Persona.cDirValor2Empleo == '' || vm.Persona.cDirValor2Empleo == null || vm.Persona.cDirValor2Empleo == undefined) {
                toastr.warning('Falta llenar el campo Nro o Mz. de dirección laboral', 'Registro Persona');
                bool = false;
            } else if (!vm.Persona.bAutoriza1) {
                toastr.warning('Debe de aceptar el uso de sus datos personales.', 'Actualización de datos');
                bool = false;
            }
            return bool;
        }

        function PersonaPermiso(valid) {
            if (valid) {
                if (validarFormulario()) {
                    vm.CodigoVerificador = codigoAleatorio();
                    var dataSMS = { cMovil: vm.Persona.cCelular, cTexto: 'Hola SoyLucas, tu código es ' + vm.CodigoVerificador };
                    dataService.postData(apiUrl + '/Alerta/SMS', dataSMS).then(function (resultSMS) {
                        //if (resultSMS.statusText == 'OK') {
                        toastr.success('Mensaje enviado.', 'Actualización de datos');
                        $('#modalConfirmar').modal('show');
                        //};
                    }, function (error) { authenticationService.errorValida(error); });
                }
            } else {
                toastr.warning('Debe de completar todos los datos requeridos.', 'Actualización')
            }
        }

        function PersonaActualiza() {
            if (vm.CodigoVerificador == vm.CodigoPermiso) {
                $('#modalConfirmar').modal('hide');
                bootbox.confirm('¿Desea continuar?', function (message) {
                    if (message) {

                        modalCargaLlamar('Estamos actualizando tus datos.');

                        vm.Persona.cCodZona = vm.Persona.cDepartamento + vm.Persona.cProvincia + vm.Persona.cDistrito + '000000';
                        vm.Persona.cCodZonaEmpleo = vm.Persona.cDepartamentoEmpleo + vm.Persona.cProvinciaEmpleo + vm.Persona.cDistritoEmpleo + '000000';
                        vm.Persona.nTipoDoc = 1;
                        vm.Persona.nCodAge = configService.getAgencia();
                        vm.Persona.cConfirmaEmail = vm.Persona.cEmail;

                        if (vm.Persona.nEjerceSI == true) {
                            vm.Persona.bCargoPublico = true;
                        } else {
                            vm.Persona.bCargoPublico = false;
                        };

                        dataService.postData(apiUrl + '/Persona/Put', vm.Persona).then(function (result) {
                            if (result.statusText == 'OK') {

                                dataService.getData(apiUrl + '/Credito/AnulaxActualizacion/' + configService.getDocumento()).then(function (resultAnula) {

                                    if (resultAnula.statusText == 'OK') {
                                        modalCargaCerrar();
                                        toastr.success('Datos actualizados!', 'Actualización');
                                        $state.go('dashboard');
                                    }
                                }, function (error) { authenticationService.errorValida(error); });
                            };
                        }, function (error) {
                            authenticationService.errorValida(error);
                            if (error.data != null) {
                                for (var i = 0; i <= error.data.length; i++) {
                                    var mensaje = error.data[i];
                                    toastr.error(mensaje.errorMessage, 'Registro');
                                    i = i + error.data.length;
                                }
                            };
                        });
                    }
                });
            } else {
                toastr.warning('Código incorrecto', 'Actualización');
            }
        };
    }

})();