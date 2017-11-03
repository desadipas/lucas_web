// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('personaController', personaController);

    personaController.$inject = ['dataService', 'configService', '$state', 'toastr', '$http', 'localStorageService', 'authenticationService', 'reglasService'];

    function personaController(dataService, configService, $state, toastr, $http, localStorageService, authenticationService, reglasService) {
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
            bAutoriza2: 0,
            cTextoSms: '',
            cTextoEmail: '',
            cTituloEmail: '',
            nProd: 0,
            nSubProd: 0,
            cLenddo: '',
            nProducto: 0,
            nModalidad: 0
        };

        vm.user = {
            userName: '',
            password: ''
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
        vm.mostrarErrorCodVerificacion = false;
        vm.mostrarErrorRUC = false;
        vm.MostrarErrorNomEmpresa = false;
        vm.Reglas;
        init();

        vm.Provincia = Provincia;
        vm.Distrito = Distrito;
        vm.ProvinciaEmpleo = ProvinciaEmpleo;
        vm.DistritoEmpleo = DistritoEmpleo;
        vm.PersonaRegistra = PersonaRegistra;
        vm.PersonaEmpleo = PersonaEmpleo;
        vm.PersonaValidaDatosPersonales = PersonaValidaDatosPersonales;
        vm.PersonaValidaDireccion = PersonaValidaDireccion;
        vm.ValidaCodigoVerificador = ValidaCodigoVerificador;
        vm.MandarLogin = MandarLogin;


        function init() {
            if (configService.getLogin()) return $state.go('dashboard');
            ValidarUser();
            vm.Persona.nCodigoVerificador = 0;
            configService.setMenus(false);
        };

        function ValidarUser() {
            var data = "grant_type=password&username=tibox@tibox.com.pe&password=TiboxWebApi&tipo=lucas";
            var url = apiUrl + '/token';

            $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (result) {
                if (result.statusText == 'OK') {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + result.data.access_token;
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
                    //reglasService.recupera('StateClienteLucas');
                };
            }, function (error) {
                authenticationService.errorValida(error);
                toastr.error('Error al cargar la pagina', 'Error');
                configService.setLogin(false);
            });
        }

        function TipoDireccion() {
            dataService.getData(apiUrl + '/Catalogocodigo/800').then(function (result) {
                vm.TipoDireccionLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function TipoDireccionEmpleo() {
            dataService.getData(apiUrl + '/Catalogocodigo/800').then(function (result) {
                vm.TipoDireccionEmpleoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function EstadoCivil() {
            dataService.getData(apiUrl + '/Catalogocodigo/100').then(function (result) {
                vm.EstadoCivilLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function Sexo() {
            dataService.getData(apiUrl + '/Catalogocodigo/2030').then(function (result) {
                vm.SexoList = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function TipoResidencia() {
            dataService.getData(apiUrl + '/Catalogocodigo/TipoVivienda').then(function (result) {
                vm.TipoResidenciaLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function ActividadEconomica() {
            dataService.getData(apiUrl + '/Catalogocodigo/12025').then(function (result) {
                vm.ActividadEconomicaLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function SituacionLaboral() {
            dataService.getData(apiUrl + '/Catalogocodigo/9910').then(function (result) {
                vm.SituacionLaboralLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function Profesion() {
            dataService.getData(apiUrl + '/Catalogocodigo/5066').then(function (result) {
                vm.ProfesionLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function TipoEmpleo() {
            dataService.getData(apiUrl + '/Catalogocodigo/12027').then(function (result) {
                vm.TipoEmpleoList = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function Departamento() {
            dataService.getData(apiUrl + '/Zona/Departamento').then(function (result) {
                vm.DepartamentoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function Provincia() {
            dataService.getData(apiUrl + '/Zona/Provincia/' + vm.Persona.cDepartamento).then(function (result) {
                vm.ProvinciaLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
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

        function PersonaRegistra(valid) {
            if (valid) {
                if (vm.Persona.bAutoriza1 == true) {
                    bootbox.confirm("¿Desea continuar?", function (message) {
                        if (message) {

                            dataService.getData(apiUrl + '/Persona/Verifica/' + vm.Persona.nNroDoc).then(function (result) {

                                if (result.statusText == 'OK' && result.data.length == 0) {

                                    dataService.getData(apiUrl + '/Persona/Celular/' + vm.Persona.nNroDoc + '/' + vm.Persona.cCelular).then(function (resultCelular) {

                                        if (resultCelular.statusText == 'OK' && resultCelular.data == 1) {

                                            var usuario = { Email: vm.Persona.cEmail };

                                            dataService.postData(apiUrl + '/Usuario/Verificar', usuario).then(function (resultEmail) {

                                                if (resultEmail.statusText == 'OK' && resultEmail.data.length == 0) {
                                                    vm.Persona.cCodZona = vm.Persona.cDepartamento + vm.Persona.cProvincia + vm.Persona.cDistrito + '000000';
                                                    vm.Persona.cCodZonaEmpleo = vm.Persona.cDepartamentoEmpleo + vm.Persona.cProvinciaEmpleo + vm.Persona.cDistritoEmpleo + '000000';
                                                    vm.Persona.nTipoDoc = 1;
                                                    vm.Persona.nCodAge = configService.getAgencia();
                                                    vm.Persona.nProd = configService.getnPro();
                                                    vm.Persona.nSubProd = configService.nSubProd();
                                                    vm.Persona.nProducto = 12;
                                                    vm.Persona.nModalidad = 0;
                                                    vm.Persona.cNombres = vm.Persona.cNombres.toUpperCase();

                                                    if (vm.Persona.nEjerceSI == true) {
                                                        vm.Persona.bCargoPublico = true;
                                                    } else {
                                                        vm.Persona.bCargoPublico = false;
                                                    };

                                                    vm.Persona.cTextoEmail = emailCuerpo('BIENVENIDO(A)', vm.Persona.cNombres, '¡Gracias por registrarte!', 'Para acceder al portal de SoyLucas, ingresa con las siguientes credenciales:', 'Usuario: ' + vm.Persona.cEmail, 'Contraseña: ' + vm.Persona.nNroDoc, 'Nota: Por seguridad debes cambiar tu contrase&ntilde;a.');
                                                    vm.Persona.cTextoSms = 'Hola, bienvenido (a) a SoyLucas. Tu usuario es el correo que ingresaste y tu contraseña el número de tu DNI. Por seguridad debes cambiar tu contraseña.';
                                                    vm.Persona.cTituloEmail = 'Bienvenido a SoyLucas ' + vm.Persona.cNombres;
                                                    dataService.postData(apiUrl + '/Persona', vm.Persona).then(function (resultPersona) {

                                                        if (resultPersona.statusText == 'OK') {
                                                            fbq('track', 'CompleteRegistration');

                                                            ga('send', 'event', 'Formularios', 'registro', 'Solicitud Completa');

                                                            toastr.success('Registro exitoso!', 'Registro Persona');
                                                            $http.defaults.headers.common.Authorization = '';

                                                            var data = "grant_type=password&username=" + vm.Persona.cEmail + "&password=" + vm.Persona.nNroDoc + "&tipo=lucas";

                                                            dataService.postData(apiUrl + '/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (result) {

                                                                if (result.statusText == 'OK') {
                                                                    $http.defaults.headers.common.Authorization = 'Bearer ' + result.data.access_token;

                                                                    localStorageService.set('userToken', {
                                                                        token: result.data.access_token,
                                                                        userName: vm.Persona.cEmail,
                                                                        nNroDoc: vm.Persona.nNroDoc,
                                                                        nCodPers: resultPersona.data.nCodPers,
                                                                        cNombres: vm.Persona.cNombres
                                                                    });

                                                                    configService.setDocumento(vm.Persona.nNroDoc);
                                                                    configService.setUserName(vm.Persona.cEmail);
                                                                    configService.setPersona(resultPersona.data.nCodPers);

                                                                    configService.setLogin(true);
                                                                    configService.setShowLogin(true);

                                                                    var dataEvaluacion = { nNroDoc: vm.Persona.nNroDoc, nProducto: 12, nModalidad: 0 };

                                                                    dataService.postData(apiUrl + '/Evaluacion/PreEvaluacion', dataEvaluacion).then(function (resultEvaluacion) {

                                                                        if (resultEvaluacion.statusText == 'OK') {
                                                                            var splited = resultEvaluacion.data.cResultado.split('|');
                                                                            evaluacionMotor(splited[1]);
                                                                        };
                                                                    }, function (error) {
                                                                        toastr.error('Error en la pre evalación.', 'Error');
                                                                        $state.go('dashboard');
                                                                    });
                                                                };
                                                            }, function (error) {
                                                                toastr.error('Error al cargar la pagína...', 'Error');
                                                            });
                                                        };
                                                    }, function (error) {
                                                        if (error.data != null) { for (var i = 0; i <= error.data.length; i++) { var mensaje = error.data[i]; toastr.error(mensaje.errorMessage, 'Registro Persona'); i = i + error.data.length; } };
                                                    });

                                                } else {
                                                    $('#iniciaSesion').modal('show');
                                                };
                                            }, function (error) { authenticationService.errorValida(error); });
                                        } else {
                                            toastr.warning('El N° de celular ya se encuentra registrado!', 'Registro Persona');
                                        }
                                    }, function (error) { authenticationService.errorValida(error); });
                                } else {
                                    $('#iniciaSesion').modal('show');
                                };
                            }, function (error) { authenticationService.errorValida(error); });
                        };
                    });
                } else {
                    toastr.warning('Para continuar debe autorizar el uso de sus datos personales', 'Registro Persona');
                };
            } else {
                toastr.warning('Debe de completar todos los campos', 'Registro Persona');
            };
        };

        function validarDatosPersona() {
            var resultado = false;

            if (ValidaCodigoVerificador()) {
                vm.mostrarErrorCodVerificacion = false;

                var celularValidar = vm.Persona.cCelular.substring(0, 1);

                if (celularValidar == '9') {

                    if (vm.Persona.cCelular != '999999999') {

                        if (validarEmail(vm.Persona.cEmail)) {

                            if (vm.Persona.cEmail === vm.Persona.cConfirmaEmail) {

                                if (validaFechaExiste(vm.Persona.dFechaNacimiento)) {
                                    resultado = true;
                                } else {
                                    toastr.warning('Ingrese una fecha real.', 'Registro Persona');
                                }
                            } else {
                                toastr.warning('Los correos no coinciden', 'Registro Persona');
                            }
                        } else {
                            toastr.warning('El correo es incorrecto', 'Registro Persona');
                        }
                    } else {
                        toastr.warning('N° de Celular no puede ser 999999999.', 'Registro Persona');
                    }
                } else {
                    toastr.warning('N° de Celular debe de empezar con 9.', 'Registro Persona')
                }
            } else {
                vm.mostrarErrorCodVerificacion = true;
                toastr.warning('El código de verificación es incorrecto.', 'Registro Persona');
            }
            return resultado;
        }

        function PersonaValidaDatosPersonales(valid) {
            if (valid) {
                if (validarDatosPersona()) {
                	debugger;
                    dataService.getData(apiUrl + '/Persona/Verifica/' + vm.Persona.nNroDoc).then(function (result) {

                        if (result.statusText == 'OK' && result.data.length == 0) {

                            dataService.getData(apiUrl + '/Persona/Celular/' + vm.Persona.nNroDoc + '/' + vm.Persona.cCelular).then(function (resultCelular) {

                                if (resultCelular.statusText == 'OK' && resultCelular.data == 1) {

                                    var usuario = { Email: vm.Persona.cEmail };
                                    dataService.postData(apiUrl + '/Usuario/Verificar', usuario).then(function (resultEmail) {

                                        if (resultEmail.statusText == 'OK' && resultEmail.data.length == 0) {

                                            if (validaFechaNacimiento(vm.Persona.dFechaNacimiento)) {
                                                $('#tabs a[data-target="#Direccion"]').tab('show');
                                            } else {
                                                toastr.warning('Debe de tener mas de 19 años.', 'Registro Persona');
                                            };
                                        } else {
                                            $('#iniciaSesion').modal('show');
                                        };
                                    }, function (error) { authenticationService.errorValida(error); });
                                } else {
                                    toastr.warning('El N° de celular ya se encuentra registrado!', 'Registro Persona');
                                }
                            }, function (error) { authenticationService.errorValida(error); });
                        } else {
                            $('#iniciaSesion').modal('show');
                        };
                    }, function (error) { authenticationService.errorValida(error); });
                }

            } else {
                toastr.warning('Debe de completar los campos requeridos.', 'Registro Persona');
            };
        };

        function PersonaValidaDireccion(valid) {
            if (valid) {
                if (vm.Persona.cDirValor2 == '' || vm.Persona.cDirValor2 == null || vm.Persona.cDirValor2 == undefined) {
                    toastr.error('Falta llenar el campo Nro o Mz.', 'Registro Persona');
                } else {
                    $('#tabs a[data-target="#LugarEmpleo"]').tab('show');
                };
            } else {
                toastr.error('Debe de completar los campos requeridos.', 'Registro Persona');
            };
        };

        function PersonaEmpleo(valid) {
            if (valid) {
                if (validaRuc()) {
                    if (validaNombreEmpresa()) {
                        if (validaFechaExiste(vm.Persona.dFecIngrLab)) {
                            $('#tabs a[data-target="#DireccionEmpleo"]').tab('show');
                        } else {
                            toastr.warning('Ingrese una fecha real.', 'Registro Persona');
                        }
                    }
                }
            } else {
                toastr.warning('Debe de completar todos los campos', 'Registro Persona');
            };
        }

        function ValidaCodigoVerificador() {
            var documento = vm.Persona.nNroDoc;
            var codigoChequeo = vm.Persona.nCodigoVerificador;

            var addition = 0;
            var hashNumbers = [];
            var OK = false;
            var Hash = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
            var identificationComponent = documento;
            var identificationComponentLength = documento.length;
            var diff = 0;
            var i = 0;

            diff = 10 - identificationComponentLength;
            i = identificationComponentLength;

            do {
                i = i - 1;
                addition = addition + (identificationComponent.substring(i, i + 1) - "0") * Hash[i + diff];
            } while (i >= 1);

            addition = 11 - (addition % 11);

            if (addition == 11) {
                addition = 0;
            };

            if (isNaN(codigoChequeo)) {
                hashNumbers = ['K', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                if (hashNumbers[addition] == codigoChequeo) {
                    OK = true;
                } else {
                    OK = false;
                };
            } else {
                hashNumbers = [6, 7, 8, 9, 0, 1, 1, 2, 3, 4, 5];
                if (hashNumbers[addition] == codigoChequeo) {
                    OK = true;
                } else {
                    OK = false;
                };
            };

            return OK
        };

        function MandarLogin() {
            $('#iniciaSesion').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $state.go('login');
        };

        function validarEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function validaRuc() {
            var ruc = vm.Persona.cRuc;
            var dependiente = document.getElementById('cmbSituacionLaboral').value;
            var formalidad = document.getElementById('cmbTipoEmpleo').value;
            var profesion = document.getElementById('cmbProfesion').value;
            var resultado = false;

            if (profesion != '5') {

                if ((dependiente == '1' && formalidad == '1') || (dependiente == '2' && formalidad == '1')) {

                    if (ruc.length == 11) {

                        if (ruc.substring(0, 2) == '10' || ruc.substring(0, 2) == '20') {

                            resultado = true;
                        } else {
                            vm.mostrarErrorRUC = true;
                            toastr.warning('N° de RUC debe de empezar con 10 o 20.', 'Registro Persona');
                        }
                    } else {
                        vm.mostrarErrorRUC = true;
                        toastr.warning('N° de RUC debe de tener 11 digitos.', 'Registro Persona');
                    }
                } else {
                    resultado = true;
                }
            } else {
                resultado = true;
            }

            if (resultado) {
                vm.mostrarErrorRUC = false;
            }

            return resultado;
        }

        function validaNombreEmpresa() {
            var dependiente = document.getElementById('cmbSituacionLaboral').value;
            var formalidad = document.getElementById('cmbTipoEmpleo').value;
            var profesion = document.getElementById('cmbProfesion').value;
            var resultado = false;

            if (profesion != '5') {

                if ((dependiente == '1' && formalidad == '1') || (dependiente == '2' && formalidad == '1')) {

                    if (vm.Persona.cNomEmpresa == '' || vm.Persona.cNomEmpresa == null) {
                        vm.MostrarErrorNomEmpresa = true;
                        toastr.warning('Falta completar el nombre de centro laboral.', 'Registro Persona');
                    } else {
                        resultado = true;
                    }
                } else {
                    resultado = true;
                }
            } else {
                resultado = true;
            }

            if (resultado) {
                vm.MostrarErrorNomEmpresa = false;
            }

            return resultado;
        }

        function motor() {
            modalCargaLlamar('Estamos evaluando tus datos...');
            dataService.postData(apiUrl + '/Evaluacion', vm.Persona).then(function (resultMotor) {

                if (resultMotor.statusText == 'OK') {
                    modalCargaCerrar();

                    var nIdFlujoMaestro = resultMotor.data.nIdFlujoMaestro;
                    toastr.success('La evaluación a terminado.', 'Evalución');
                    if (resultMotor.data.nRechazado == 1) {

                        var cMensaje = 'Hola SoyLucas, lamento informarte que en este momento no cumples con los requisitos para aprobarte el prestamo, espero poder atenderte más adelante. ';

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
                };
            }, function (error) { authenticationService.errorValida(error); });
        }

        function evaluacionMotor(tipo) {
            if (tipo == 'BANCARIZADO') {
                toastr.success('La evaluación a comenzado..', 'Evaluación');
                motor();
            } else {
                if (vm.Persona.nTipoEmp == 1 && vm.Persona.nSitLab == 1) {
                    motor();
                } else {
                    var obj = document.getElementById('VERIFI_ME');
                    obj.click();
                    toastr.success('Te llevaremos a otra ventana..', 'Evaluación');
                }
            }
        }
    };

})();