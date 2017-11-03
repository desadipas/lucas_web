// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').config(config).run(run);

    config.$inject = ['$compileProvider'];

    function config($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }

    run.$inject = ['$http', '$state', 'localStorageService', 'configService', '$rootScope'];

    function run($http, $state, localStorageService, configService, $rootScope) {
        
        pintaConsola();

        var user = localStorageService.get('userToken');
        if (user && user.token != '') {
            $http.defaults.headers.common.Authorization = 'Bearer ' + user.token;
            
            configService.setLogin(true);
            configService.setShowLogin(true);
            configService.setAgencia(5);
            configService.setnPro(3);
            configService.setnSubProd(9);

            var user = localStorageService.get('userToken');
            configService.setDocumento(user.nNroDoc);
            configService.setUserName(user.userName);
            configService.setPersona(user.nCodPers);

            var userState = localStorageService.get('userState');
            if (userState) {
                configService.setChangePass(userState.state);
            }else{
                configService.setChangePass(1);
            }
            
        } else {
            $state.go('home');
        }

    }


})();