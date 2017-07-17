(function(firebase) {
    'use strict';
    angular.module('app')
    .factory('HomeFactory', HomeFactory);

    HomeFactory.$inject = ['$http', '$q', '$rootScope'];

    function HomeFactory($http, $q, $rootScope) {
        var o = {};


        o.MailSender = function(mail){
            var q = $q.defer();
            console.log('sending mail from factory', mail)
            $http.post('/mail', mail).success(function(res){
                q.resolve(res);
            }).error(function(){
                return 'Error could not send mail'
            })
              return q.promise;
        }
        return o;
    }
})();
