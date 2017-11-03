// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('tratamientoController', tratamientoController);

    tratamientoController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function tratamientoController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.Tratamiento = {
            nCodPers: 0,
            cDocumento: '',
            cUsuario: '',
            cApePat: '',
            cApeMat: '',
            cNombres: '',
            nCodAge: 0,
            nTipoSolicitud: '',
            nModoRegistro: 0,
            nTipoResp: '',
            cPedido: '',
            cComentario: '',
            nCodPersTit: 0,
            cApePatTit: '',
            cApeMatTit: '',
            cNomTit: '',
            cDocumentoTit: ''
        };

        vm.Persona = {};

        vm.regitraTratamiento = regitraTratamiento;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getChangePass() == 0) return $state.go('contrasenia');
            datos();
        };

        function datos() {
            var datosPersona = { cEmail: configService.getUserName(), nNroDoc: configService.getDocumento(), nCodPers: configService.getPersona() };
            dataService.postData(apiUrl + '/Persona/Datos', datosPersona).then(function (result) {
                vm.Persona = result.data[0];
                vm.Tratamiento.cDocumento = configService.getDocumento();
                vm.Tratamiento.cApePat = vm.Persona.cApePat;
                vm.Tratamiento.cApeMat = vm.Persona.cApeMat;
                vm.Tratamiento.cNombres = vm.Persona.cNombres;
            }, function (error) { console.log(error); });
        }

        function regitraTratamiento(val) {
            if (val) {
                bootbox.confirm('¿Desea continuar?', function (message) {
                    if (message) {
                        vm.Tratamiento.nCodPers = configService.getPersona();
                        vm.Tratamiento.cDocumento = configService.getDocumento();
                        vm.Tratamiento.cUsuario = 'USU-LUCAS';
                        vm.Tratamiento.nCodAge = configService.getAgencia();
                        vm.Tratamiento.nModoRegistro = 2;
                        vm.Tratamiento.nCodPersTit = 0;
                        vm.Tratamiento.cApePatTit = '';
                        vm.Tratamiento.cApeMatTit = '';
                        vm.Tratamiento.cNomTit = '';
                        vm.Tratamiento.cDocumentoTit = '';

                        dataService.postData(apiUrl + '/Persona/Tratamiento', vm.Tratamiento).then(function (result) {
                            if (result.statusText == 'OK') {
                                toastr.success('Registro exitoso!.', 'Tratamiento de datos');
                                $state.go('dashboard');
                            }
                        }, function (error) { console.log(error); });
                    };
                });
            } else {
                toastr.warning('Debe de completar todos los campos.', 'Tratamiento de datos');
            };
        };
    }

})();