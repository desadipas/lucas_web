// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: URL.BASE + '/App/public/login/login.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: URL.BASE + '/App/public/login/login.html'
            })
            .state('registro', {
                url: '/registro',
                templateUrl: URL.BASE + '/App/public/persona/persona.html'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: URL.BASE + '/App/private/dashboard/dashboard.html'
            })
            .state('ActualizaDatos', {
                url: '/actualizaDatos',
                templateUrl: URL.BASE + '/App/private/personaAct/personaAct.html'
            })
            .state('lenddo', {
                url: '/lenddo',
                templateUrl: URL.BASE + '/App/private/lenddo/lenddo.html'
            })
            .state('lenddoCancela', {
                url: '/lenddoCancela',
                templateUrl: URL.BASE + '/App/private/lenddo/lenddoCancela.html'
            })
            .state('rechazado', {
                url: '/rechazado',
                templateUrl: URL.BASE + '/App/private/rechazado/rechazado.html'
            })
            .state('StateDocumento', {
                url: '/StateDocumento',
                templateUrl: URL.BASE + '/App/private/documento/documento.html'
            })
            .state('StateSolicitud', {
                url: '/StateSolicitud',
                templateUrl: URL.BASE + '/App/private/solicitud/solicitud.html'
            })
            .state('StateInformacion', {
                url: '/StateInformacion',
                templateUrl: URL.BASE + '/App/private/modalidad/modalidad.html'
            })
            .state('StateInfoContrato', {
                url: '/StateInfoContrato',
                templateUrl: URL.BASE + '/App/private/firmaElectronica/firmaElectronica.html'
            })
            .state('StateFinContrato', {
                url: '/StateFinContrato',
                templateUrl: URL.BASE + '/App/private/fin/fin.html'
            })
            .state('detalles', {
                url: '/detalles',
                templateUrl: URL.BASE + '/App/private/detalles/detalles.html'
            })
            .state('contrasenia', {
                url: '/contrasenia',
                templateUrl: URL.BASE + '/App/private/contrasenia/contrasenia.html'
            })
            .state('tratamiento', {
                url: '/tratamiento',
                templateUrl: URL.BASE + '/App/private/tratamiento/tratamiento.html'
            })
            .state('reclamaciones', {
                url: '/reclamaciones',
                templateUrl: URL.BASE + '/App/public/libro_reclamaciones/libroReclamaciones.html'
            })
            .state('otherwise', {
                url: '*path',
                templateUrl: URL.BASE + '/App/public/login/login.html'
            });

    }

})();