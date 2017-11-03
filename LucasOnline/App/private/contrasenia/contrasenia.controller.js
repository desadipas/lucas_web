// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('contraseniaController', contraseniaController);

    contraseniaController.$inject = ['dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService'];

    function contraseniaController(dataService, configService, $state, localStorageService, toastr, authenticationService) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.CodigoVerificador;
        vm.CodigoPermiso;
        vm.Password = '';
        vm.Movil = '';
        vm.userCambio = {
            passwordActual: '',
            passwordNuevo: '',
            passwordRepite: ''
        };

        vm.enviaCodigo = enviaCodigo;
        vm.cambiaContrasenia = cambiaContrasenia;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getChangePass() == 0) toastr.warning('Es necesario cambiar su contraseña!', 'Soy Lucas');
            datos();
        }

        function datos() {
            var usuario = { Email: configService.getUserName() };
            dataService.postData(apiUrl + '/Usuario/Verificar', usuario).then(function (resultEmail) {
                if (resultEmail.statusText == 'OK' && resultEmail.data.length > 0) {
                    vm.Movil = resultEmail.data[0].cMovil;

                    var desencriptar = { Password: resultEmail.data[0].password };
                    dataService.postData(apiUrl + '/Usuario/Desencriptar', desencriptar).then(function (desemcriptar) {
                        vm.Password = desemcriptar.data.cTexto;
                    }, function (error) { authenticationService.errorValida(error); });
                }
            }, function (error) { authenticationService.errorValida(error); });
        }

        function enviaCodigo() {
            vm.CodigoVerificador = codigoAleatorio();
            var dataSMS = { cMovil: vm.Movil, cTexto: 'Hola SoyLucas, tu código es ' + vm.CodigoVerificador };
            dataService.postData(apiUrl + '/Alerta/SMS', dataSMS).then(function (resultSMS) {
                if (resultSMS.statusText == 'OK') {
                    toastr.success('Mensaje enviado.', 'Datos del préstamo');
                };
            }, function (error) { authenticationService.errorValida(error); });
        };

        function cambiaContrasenia(val) {
            if (val) {
                if (!validarContraseña(vm.userCambio.passwordActual) && !validarContraseña(vm.userCambio.passwordNuevo)) {
                    if (vm.Password == vm.userCambio.passwordActual) {
                        if (vm.userCambio.passwordNuevo == vm.userCambio.passwordRepite) {
                            if (vm.CodigoVerificador == vm.CodigoPermiso) {

                                bootbox.confirm('¿Desea continuar?', function (message) {
                                    if (message) {
                                        var dataCambio = { Email: configService.getUserName(), Password: vm.userCambio.passwordNuevo };
                                        dataService.postData(apiUrl + '/Usuario/CambioPass', dataCambio).then(function (result) {
                                            if (result.statusText == 'OK') {

                                                var dataSMS = { cMovil: vm.Movil, cTexto: 'Hola SoyLucas, tu contraseña ya fue cambiada!' };
                                                dataService.postData(apiUrl + '/Alerta/SMS', dataSMS).then(function (resultSMS) {
                                                    if (resultSMS.statusText == 'OK') {

                                                        localStorageService.set('userState', {
                                                            state: 1
                                                        });

                                                        configService.setChangePass(1);

                                                        toastr.success('Su contraseña fue cambiada!', 'Cambio de contraseña');
                                                        $state.go('dashboard');
                                                    };
                                                }, function (error) { authenticationService.errorValida(error); });
                                            };
                                        }, function (error) { authenticationService.errorValida(error); });
                                    }
                                });
                            } else {
                                toastr.warning('Código incorrecto', 'Cambio de contraseña');
                            };
                        } else {
                            toastr.warning('Las contraseñas nuevas no son iguales.','Cambio de contraseña');
                        }
                    } else {
                        toastr.warning('Su contraseña actual es incorrecta', 'Cambio de contraseña');
                    };
                } else {
                    toastr.warning('Su contraseña no debe de tener espacios', 'Cambio de contraseña');
                };
            } else {
                toastr.warning('Debe de completar todos los campos.', 'Cambio de contraseña');
            };
        }

    }

})();