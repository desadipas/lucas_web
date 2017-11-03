// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('loginController', loginController);

    loginController.$inject = ['authenticationService', '$state', 'configService', 'toastr', 'dataService', '$http'];

    function loginController(authenticationService, $state, configService, toastr, dataService, $http) {
        var apiUrl = configService.getApiUrl();
        var vm = this;
        vm.user = {};
        vm.userCambio = {};
        vm.singIn = login;
        vm.validarCambio = validarCambio;
        vm.cambiarContrasena = cambiarContrasena;
        vm.Codigo;
        vm.Celular;

        init();

        function init() {
            if (configService.getLogin()) return $state.go('dashboard');
            configService.setMenus(false);
            var data = "grant_type=password&username=tibox@tibox.com.pe&password=TiboxWebApi&tipo=lucas";
            var url = apiUrl + '/token';
            $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (result) {
                if (result.statusText == 'OK') {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + result.data.access_token;
                };
            }, function (error) {
                toastr.error('Error al cargar la pagína...', 'Error');
            });
        };

        function login(valid) {
            if (valid) {
                authenticationService.login(vm.user);
            } else {
                toastr.error('Completa los campos.', 'Inicio de sesión');
            }
        };

        function cambiarContrasena(valid) {
            if (valid) {
                if (vm.userCambio.CodigoVeri == vm.Codigo) {
                    var dataCambio = { Email: vm.userCambio.userName, Password: vm.userCambio.password1 };
                    dataService.postData(apiUrl + '/Usuario/CambioPass', dataCambio).then(function (result) {
                        if (result.statusText == 'OK') {

                            var dataSMS = { cMovil: vm.Celular, cTexto: 'Hola SoyLucas, tu contraseña ya fue cambiada!' };
                            dataService.postData(apiUrl + '/Alerta/SMS', dataSMS).then(function (resultSMS) {
                                if (resultSMS.statusText == 'OK') {
                                    toastr.success('Su contraseña fue cambiada!', 'Cambio de contraseña');

                                    vm.user.userName = vm.userCambio.userName;
                                    vm.user.password = vm.userCambio.password1;
                                    authenticationService.login(vm.user);
                                };
                            }, function (error) { authenticationService.errorValida(error); });
                        };
                    }, function (error) { authenticationService.errorValida(error); });
                } else {
                    toastr.warning('El código es incorrecto.', 'Cambio de contraseña');
                };
            } else {
                toastr.warning('Ingrese código enviado.', 'Cambio de contraseña');
            };
        };

        function validarCambio(valid) {
            if (valid) {
                if (vm.userCambio.password1.length > 7 && vm.userCambio.password1.length < 15) {
                    if (!validarContraseña(vm.userCambio.password1) && !validarContraseña(vm.userCambio.password2)) {
                        if (vm.userCambio.password1 === vm.userCambio.password2) {
                            var usuario = { Email: vm.userCambio.userName };
                            dataService.postData(apiUrl + '/Usuario/Verificar', usuario).then(function (resultEmail) {
                                if (resultEmail.statusText == 'OK' && resultEmail.data.length == 0) {
                                    toastr.warning('Usted no se encuentra registrado.', 'Cambio de contraseña');
                                } else {
                                    $('#tabs a[data-target="#olvidasteConfirmacion"]').tab('show');
                                    vm.Codigo = codigoAleatorio();
                                    vm.Celular = resultEmail.data[0].cMovil;
                                    var dataSMS = { cMovil: vm.Celular, cTexto: 'Hola SoyLucas, tu código de para el cambio de contraseña es ' + vm.Codigo };
                                    dataService.postData(apiUrl + '/Alerta/SMS', dataSMS).then(function (resultSMS) {
                                        if (resultSMS.statusText == 'OK') {
                                            toastr.success('Mensaje enviado.', 'Cambio de contraseña');
                                        };
                                    }, function (error) { authenticationService.errorValida(error); });
                                };
                            }, function (error) { authenticationService.errorValida(error); });
                        } else {
                            toastr.warning('Las contraseñas deben de ser iguales.', 'Cambio de contraseña');
                        };
                    } else {
                        toastr.warning('Su contraseña no debe de tener espacios.', 'Cambio de contraseña');
                    };
                } else {
                    toastr.warning('Su contraseña debe de tener de 7 a 15 carácteres.', 'Cambio de contraseña');
                };
            } else {
                toastr.warning('Debe de completar todos los datos.', 'Cambio de contraseña');
            };
        };
    }

})();