// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').factory('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', '$state', 'localStorageService', 'configService', 'toastr'];

    function authenticationService($http, $state, localStorageService, configService, toastr) {
        var service = {};
        service.login = login;
        service.logout = logout;
        service.errorValida = errorValida;

        return service;

        function login(user) {
            var url = configService.getApiUrl() + '/token';
            var apiUrl = configService.getApiUrl();
            var data = "grant_type=password&username=" + user.userName + "&password=" + user.password + "&tipo=lucas";
            $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (result) {
                if (result.statusText == 'OK') {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + result.data.access_token;

                    var usuario = { Email: user.userName };
                    $http.post(apiUrl + '/Usuario/DatosLogin', usuario).then(function (resultDatos) {
                        
                        if (resultDatos.statusText == 'OK') {
                            localStorageService.set('userToken', {
                                token: result.data.access_token,
                                userName: user.userName,
                                nNroDoc: resultDatos.data[0].nNroDoc,
                                nCodPers: resultDatos.data[0].nCodPers,
                                cNombres: resultDatos.data[0].cNombres
                            });
                            
                            configService.setLogin(true);
                            configService.setShowLogin(true);

                            localStorageService.set('userState', {
                                state: resultDatos.data[0].changePass
                            });

                            configService.setChangePass(resultDatos.data[0].changePass);
                            
                            $state.go('dashboard');
                            toastr.success('Bienvenido ' + resultDatos.data[0].cNombres, 'Soy Lucas');
                        };
                    }, function (error) { errorValida(error); });
                };
            }, function (error) {
                errorValida(error);
                toastr.error('Usuario y/o contraseña invalidos.', 'Error');
                configService.setLogin(false);
            });
        }

        function logout() {
            $http.defaults.headers.common.Authorization = '';
            localStorageService.remove('userToken');
            localStorageService.remove('userState');
            configService.setLogin(false);
            configService.setShowLogin(false);
            window.location = URL.INICIO;
        }

        function errorValida(error) {
            console.log(error);
            modalCargaCerrar();
            if (error.statusText == 'Unauthorized') {
                toastr.warning('Tu sesion a caducado, por favor vuelve a iniciar!', 'Alerta');
                logout();
            } else if(error.statusText == 'Bad Request'){
                if (error.data.error == 'invalid_grant') {
                    console.log('Usuario y/o contrasenia invalidos!!!');
                }
            } else if(error.statusText == 'Internal Server Error'){
            	toastr.error('Tu conexión a internet es muy lenta, por favor verifica tu señal de internet.', 'Soy Lucas');
                logout();
            }
            pintaConsola();
        }

        
    }

})();