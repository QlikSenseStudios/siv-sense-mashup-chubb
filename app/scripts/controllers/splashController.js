'use strict';

app.controller('splashController', 
[
    '$rootScope',
    '$scope', 
    '$interval',
    '$filter',
    '$location',
    '$timeout',
    '$cookies',
    function (
        $rootScope,
        $scope,
        $interval,
        $filter,
        $location,
        $timeout,
        $cookies
    ) {
        $scope.MaxSplashNum = 6;
        $scope.splashNum = 1;
        $scope.bkgImage = "../images/splash/" + $scope.splashNum + ".jpg";
        $scope.curVal = 1;
        $scope.maxVal = 100;
        $scope.i = null;
        $scope.skip = false;

        $scope.init = function () {
            
            $rootScope.inSplash = false;

            $scope.i = $interval(function () {
                $scope.curVal+=0.25;
                if ($scope.curVal >= $scope.maxVal) {
                    $scope.nextSplash();
                }
            }, 15, 0);

            if ($cookies.get('straightToAnalysis')) {
                $rootScope.inSplash = false;
                $scope.slideDown(true);
            } else {
                $('#splashContainer').css('opacity', '1.0');
                $rootScope.inSplash = true;
            }
        };

        $scope.getImage = function(num) {
            return $.get('images/splash/' + num + '.jpg');
        };

        $scope.checkClick = function () {
            $scope.skip = true;
            $timeout(function () {
                $scope.slideDown();
            }, 500);

             $cookies.put('straightToAnalysis', 'true');
            
        };

        $scope.nextSplash = function () {

            if (!$rootScope.inSplash) {
                return;
            }

            $scope.curVal = 0;
            var next = (($scope.splashNum + 1) > $scope.MaxSplashNum ? 1 :  $scope.splashNum + 1);
            var next_follows = (($scope.splashNum + 2) > $scope.MaxSplashNum ? 1 :  $scope.splashNum + 2);

            $scope.getImage(next)
            .then(function () {                                
                    
                    $("#index-cover-fader").animate({"opacity":"0.85"}, 1000, function () {
                        $scope.splashNum = next;
                        $("#index-cover-fader").animate({"opacity":"0.0"}, 600);
                    });
                    $scope.getImage(next_follows);
            });
        };

        $rootScope.goToSection = function (section) {
            var url_target = $filter('urlConverter')(section.title, $rootScope.defaultSection);
            $location.path(url_target);
            $scope.slideDown();
        };

        $scope.slideDown = function (straight) {
            var delayed = 1000;

            if (straight) {
                $interval.cancel($scope.i);
                $rootScope.inSplash = false;
                $(".contentwrap").css('opacity', "1.0");
                $(".splash").css('display', 'none');
                return;
            }

            $interval.cancel($scope.i);
            $rootScope.inSplash = false;
            $(".contentwrap").css('opacity', "0");
            $(".splash").slideUp(delayed, function() {
                $(".contentwrap").animate({"opacity":"1.0"}, delayed / 2);
            });
        };

        $scope.init();

    }
]);


