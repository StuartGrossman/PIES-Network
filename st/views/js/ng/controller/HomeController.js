(function(){
    'use strict'
    angular.module('app').controller('HomeController', HomeController);
    HomeController.$inject = ['HomeFactory'];

    function HomeController(HomeFactory){
        var vm = this;
		 vm.json = [

		        ]
        console.log("angular is working!");
        var text = "hello";

        vm.changeData = function(){
        	vm.json.push(vm.text);
        }

       vm.deleteAtIndex = function(index){
       	console.log(index)
       	vm.json.splice(index, 1);
       }
    }

})();