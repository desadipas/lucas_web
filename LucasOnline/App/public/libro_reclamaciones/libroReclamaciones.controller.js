(function (undefined) {

    'use strict';

    angular.module('app').controller('libroReclamacionesController', libroReclamacionesController);

    libroReclamacionesController.$inject = ['dataService', 'configService', '$state', 'toastr', '$http', 'localStorageService', 'authenticationService', 'reglasService'];

    function libroReclamacionesController(dataService, configService, $state, toastr, $http, localStorageService, authenticationService, reglasService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.Libro = {
            nCodPers: 0,
            nTipoDoc: '',
            cDocumento: '',
            cNombres: '',
            cApePat: '',
            cApeMat: '',
            cNomMadrePadre: '',
            cDireccion: '',
            cCelular: '',
            cMail: '',
            cContrato: '',
            dFechaOcu: '',
            nMontoReclamado: '',
            cPedido: '',
            cObservaciones: '',
            cLote: '',
            cDpto:'',
            cDepartamento: '',
            cProvincia: '',
            cDistrito: '',
            cTipoRespuesta: '',
            nAgencia:'0'
        };

        vm.TipoDoc = [];
        vm.AgenciaLista = [];
        vm.bloquear = false;

        vm.LibroReclamacion = LibroReclamacion;
        vm.Provincia = Provincia;
        vm.Distrito = Distrito;

        init();

        function init() {
            vm.Libro.cTipoRespuesta = '1';
            vm.Libro.nAgencia = '0';
            if (!configService.getLogin()) {
                var data = "grant_type=password&username=tibox@tibox.com.pe&password=TiboxWebApi&tipo=lucas";
                var url = apiUrl + '/token';

                $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (result) {
                    if (result.statusText == 'OK') {
                        $http.defaults.headers.common.Authorization = 'Bearer ' + result.data.access_token;
                        TipoDocumento();
                        Departamento();
                        AgenciasLista();
                    };
                }, function (error) {
                    authenticationService.errorValida(error);
                    toastr.error('Error al cargar la pagina', 'Error');
                });
            } else {
                TipoDocumento();
                cargaDatosPersona();
                Departamento();
                AgenciasLista();
            }
        }

        function AgenciasLista() {
            dataService.getData(apiUrl + '/Agencia').then(function (result) {
                vm.AgenciaLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        } 

        function Departamento() {
            dataService.getData(apiUrl + '/Zona/Departamento').then(function (result) {
                vm.DepartamentoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        };

        function Provincia() {
            dataService.getData(apiUrl + '/Zona/Provincia/' + vm.Libro.cDepartamento).then(function (result) {
                vm.ProvinciaLista = result.data;
            }, function (error) { authenticationService.errorValida(error); })
        }

        function Distrito() {
            dataService.getData(apiUrl + '/Zona/Distrito/' + vm.Libro.cDepartamento + '/' + vm.Libro.cProvincia).then(function (result) {
                vm.DistritoLista = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function cargaDatosPersona() {
            var datosPersona = { cEmail: configService.getUserName(), nNroDoc: configService.getDocumento(), nCodPers: configService.getPersona() };
            dataService.postData(apiUrl + '/Persona/Datos', datosPersona).then(function (result) {
                var Persona = result.data[0];
                vm.Libro.nTipoDoc = '1';
                vm.Libro.nCodPers = Persona.nCodPers;
                vm.Libro.cDocumento = Persona.nNroDoc;
                vm.Libro.cNombres = Persona.cNombres;
                vm.Libro.cApePat = Persona.cApePat;
                vm.Libro.cApeMat = Persona.cApeMat;
                vm.Libro.cDireccion = Persona.cDirValor1;
                vm.Libro.cLote = Persona.cDirValor2;
                vm.Libro.cDpto = Persona.cDirValor3;
                vm.Libro.cDepartamento = Persona.cDepartamento;
                vm.Libro.cProvincia = Persona.cProvincia;
                vm.Libro.cDistrito = Persona.cDistrito;
                vm.Libro.cCelular = Persona.cCelular;
                vm.Libro.cMail = Persona.cEmail;
                Provincia();
                Distrito();
                vm.bloquear = true;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function TipoDocumento() {
            dataService.getData(apiUrl + '/CatalogoCodigo/TipoDoc').then(function (result) {
                vm.TipoDoc = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function LibroReclamacion(val) {
            if (val) {
                if (vm.Libro.cObservaciones.length > 500) {
                    toastr.warning('El texto de observaciones debe de tener menos de 500 caracteres.', 'Libro de Reclamaciones');
                } else {
                    if (vm.Libro.cPedido.length > 200) {
                        toastr.warning('El Texto de pedidos debe de tenes menos de 200 caracteres.', 'Libro de Reclamaciones');
                    } else {
                        bootbox.confirm("¿Desea continuar?", function (message) {
                            if (message) {
                                var libro = {
                                    nCodPers: vm.Libro.nCodPers,
                                    cDocumento: vm.Libro.cDocumento,
                                    cApePat: vm.Libro.cApePat,
                                    cApeMat: vm.Libro.cApeMat,
                                    cNombres: vm.Libro.cNombres,
                                    cContrato: vm.Libro.cContrato,
                                    cDomicilioWeb: vm.Libro.cDireccion + '/' + vm.Libro.cLote + '/' + vm.Libro.cDpto + '/' + TextoCombo('cmbDistrito') + '/' + TextoCombo('cmbProvincia') + '/' + TextoCombo('cmbDepartamento'),
                                    cTelefonoWeb: vm.Libro.cCelular,
                                    cEmailWeb: vm.Libro.cMail,
                                    cPadres: vm.Libro.cNomMadrePadre,
                                    nMontoReclamado: vm.Libro.nMontoReclamado,
                                    cObservaciones: vm.Libro.cObservaciones,
                                    cObsPedido: vm.Libro.cPedido,
                                    nTipoResp: vm.Libro.cTipoRespuesta,
                                    nAgenciaRespuesta: vm.Libro.nAgencia
                                };
                                dataService.postData(apiUrl + '/LibroReclamacion', libro).then(function (result) {
                                    if (result.statusText == 'OK') {
                                        toastr.success('Registro satisfactorio!', 'Libro de Reclamaciones');
                                        if (!configService.getLogin()) {
                                            window.location = URL.INICIO;
                                        } else {
                                            $state.go('dashboard');
                                        }
                                    }
                                }, function (error) { authenticationService.errorValida(error); });
                            }
                        });
                    }
                }
            } else {
                toastr.warning('Debe de completar los campos obligatorios!', 'Soy Lucas');
            }
        }


    }

})();