// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Soy Lucas v1.0                                                     │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2017 Hugo Roca - Tibox (hugo.roca@tibox.com.pe)        │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// └────────────────────────────────────────────────────────────────────┘ \\    
(function () {

    'use strict';

    angular.module('app').controller('documentoController', documentoController);

    documentoController.$inject = ['$http', 'dataService', 'configService', '$state', 'localStorageService', 'toastr', 'authenticationService', '$scope'];

    function documentoController($http, dataService, configService, $state, localStorageService, toastr, authenticationService, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        vm.nIdFlujoMaestro;
        vm.TipoDocumento;
        vm.TipoDoc = '';
        vm.Documentos = [];
        vm.Archivos = [];
        vm.ImagenColeccion = [];
        vm.files;
        vm.Wizard;
        vm.Flujo;

        vm.quitarArchivo = quitarArchivo;
        vm.DocumentosGrabar = DocumentosGrabar;

        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            if (configService.getFlujo() == 0) return $state.go('dashboard');
            vm.nIdFlujoMaestro = configService.getFlujo();
            configService.setFlujo(0);

            datos();
            Wizard();
            vm.TipoDoc = '4';
        }

        function datos() {
            dataService.getData(apiUrl + '/Documento/Tipo').then(function (result) {
                vm.TipoDocumento = result.data;

                dataService.getData(apiUrl + '/Flujo/' + vm.nIdFlujoMaestro).then(function (flujo) {
                    vm.Flujo = flujo.data[0];
                }, function (error) { authenticationService.errorValida(error); });
            }, function (error) { authenticationService.errorValida(error); });
        }

        function Wizard() {
            dataService.getData(apiUrl + '/Flujo/Wizard/' + vm.nIdFlujoMaestro).then(function (result) {
                vm.Wizard = result.data;
            }, function (error) { authenticationService.errorValida(error); });
        }

        function quitarArchivo(index) {
            vm.Documentos.splice(index, 1);
            vm.Archivos.splice(index, 1);
            vm.ImagenColeccion.splice(index, 1);
        }

        $scope.LoadFileDataFil = function (files) {
            if (vm.TipoDoc == '') {
                toastr.warning('Primero debe de seleccionar un tipo de documento', 'Documentos');
            } else {
                var bool = false;
                $scope.$apply(function () {

                    for (var i = 0; i < files.length; i++) {

                        if (files[i].type == 'image/png' ||
                            files[i].type == 'image/jpeg' ||
                            files[i].type == 'image/gif' ||
                            files[i].type == 'application/msword' ||
                            files[i].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                            files[i].type == 'application/pdf') {

                            vm.Archivos.push(files[i]);

                            vm.Documentos.push({
                                cNomArchivo: files[i].name,
                                size: files[i].size,
                                type: files[i].type,
                                cTipoArchivo: getSelectedText("cmbDocumentos")
                            });

                            bool = true;
                        } else {
                            bool = false;
                            toastr.warning('Tipo de archivo no aceptado!', 'Documentos');
                        }
                    };
                });

                if (bool) {
                    for (var i = 0; i < files.length; i++) {

                        var reader = new FileReader();
                        reader.fileName = files[i].name;
                        var clase = files[i].type;
                        reader.onload = function (event) {

                            var image = {};
                            image.Name = event.target.fileName;
                            image.Size = (event.total / 1024).toFixed(2);
                            image.Src = event.target.result;
                            image.Tipo = getSelectedText("cmbDocumentos");
                            image.class = clase;

                            var doc = image;
                            var subir = {
                                oDocumento: obtenerBase64(doc.Src),
                                cNomArchivo: doc.Name,
                                cExtencion: doc.class,
                                nIdFlujoMaestro: vm.nIdFlujoMaestro,
                                cTipoArchivo: doc.Tipo
                            };

                            dataService.postData(apiUrl + '/Documento/Subir', subir).then(function (result) {
                                if (result.statusText == 'OK') {
                                    toastr.success('Documento cargado correctamente', 'Documento');
                                }
                            }, function (error) { authenticationService.errorValida(error); });
                        }
                        reader.readAsDataURL(files[i]);
                    }
                }
            }
        }

        function obtenerBase64(base64StringFromURL) {
            var parts = base64StringFromURL.split(";base64,");
            //var contentType = parts[0].replace("data:", "");
            return parts[1];
        }

        function DocumentosGrabar() {
            if (vm.TipoDocumento != null) {
                var archivos = vm.Documentos;
                var valida = [];
                var nContar1 = 0;
                var nContar2 = 0;
                var bEval = false;
                var bRepite = 0;

                for (var i = 0; i < vm.TipoDocumento.length; i++) {
                    var cDoc = vm.TipoDocumento[i].cNombreDoc.split("-");
                    if (cDoc.length > 1) {
                        nContar1 = nContar1 + 1;
                        bEval = false;
                        if (archivos.length == null) valida.push(cDoc[0]);
                        else {
                            for (var j = 0; j < archivos.length; j++) {
                                if (vm.TipoDocumento[i].cNombreDoc == archivos[j].cTipoArchivo) {
                                    nContar2 = nContar2 + 1;
                                    bEval = true;
                                    j = j + archivos.length;
                                }
                            }
                            if (bEval == false) valida.push(cDoc[0]);
                        }
                    }
                }

                if (nContar2 != nContar1) {
                    toastr.warning('Le falta subir documentos obligatorios', 'Documentos');
                } else {
                    bootbox.confirm("¿Desea continuar?", function (message) {
                        if (message) {
                            ga('send', 'event', 'Formularios', 'registro', 'Aprobado');
                            var datoFlujo = {
                                nProd: vm.Flujo.nProd,
                                nSubProd: vm.Flujo.nSubProd,
                                cNomform: vm.Flujo.cNomform,
                                nCodPers: configService.getPersona(),
                                nNroDoc: configService.getDocumento(),
                                cUsuReg: configService.getUserName(),
                                nIdFlujo: vm.Flujo.nIdFlujo,
                                nCodCred: 0,
                                nCodAge: vm.Flujo.nCodAge,
                                nCodPersReg: configService.getPersona(),
                                nOrdenFlujo: vm.Flujo.nOrdenFlujo,
                                nIdFlujoMaestro: vm.nIdFlujoMaestro
                            }

                            dataService.postData(apiUrl + '/Flujo', datoFlujo).then(function (result) {
                                if (result.statusText == 'OK') {

                                    dataService.getData(apiUrl + '/Flujo/' + vm.nIdFlujoMaestro).then(function (flujo) {
                                        if (flujo.statusText == 'OK') {
                                            toastr.success('Registro completado.', 'Documento');
                                            var cruta = flujo.data[0].cNomform;
                                            configService.setFlujo(vm.nIdFlujoMaestro);
                                            $state.go(cruta);
                                        }
                                    }, function (error) { authenticationService.errorValida(error); });
                                }
                            }, function (error) { authenticationService.errorValida(error); });
                        }
                    });
                }
            } else {
                toastr.warning('Debe de adjuntar archivos.', 'Documentos');
            }
        }
    }

})();