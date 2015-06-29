/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="colorpicker.ts" />
/// <reference path="wheelcanvas.ts" />
module WheelFunctions {
    
    export function LoadAngularModule() {
        var spinningWheelApp = angular.module('spinningWheelApp', []);
        spinningWheelApp.controller('ideasController', ['$scope', function ($scope) {

            //Scope Variables
            $scope.ideaList = JSON.parse($('#hdnData').val());
            $scope.setIdeasCt = $scope.ideaList.length;
            $scope.selectedIdea = null;
            $scope.spinWheeel = function () {
                SpinWheel();
            };
            $scope.resetWheel = function () {
                ResetWheel();
            };

            //Control functions
            function SpinWheel() {
                $('#btnSpin').hide();
                if ($scope.selectedIdea == null) {
                    RotateWheel(function (randIdeaID) {
                        var randomIdea: Idea = $scope.ideaList[randIdeaID],
                            intervalsToWait = 4,
                            counter = 0;

                        $('#lblWheelSelection').text(randomIdea.val);

                        var a = setInterval(function () {
                            var lblLoading = $('#lblLoading');
                            lblLoading.text('Loading Next Step');

                            for (var i = 0; i < counter; i++) {
                                lblLoading.append('.');
                            }

                            if (counter > intervalsToWait) {
                                clearInterval(a);
                                lblLoading.text('');
                                WheelCanvas.BuildWheel(PopulateOptionsSpinner(randIdeaID), true);
                                $('#btnSpin').show();
                            }
                            counter++;
                        }, 500);

                        $scope.selectedIdea = randIdeaID;
                    });
                } else if ($scope.selectedIdea !== null) {
                    RotateWheel(function (optVal) {
                        var randomIdea: Idea = $scope.ideaList[$scope.selectedIdea];
                        var randomOpt: string = randomIdea.opt[optVal];

                        $('#lblWheelSelection').append(" - " + randomOpt);
                        $('#btnReSpin').show();
                    });
                }
            }

            function ResetWheel() {
                ColorPicker.ClearSelected();
                $scope.selectedIdea = null;
                $('#lblWheelSelection').text('');
                WheelCanvas.BuildWheel(PopulateIdeasSpinner(), true);
                $('#btnSpin').show();
                $('#btnReSpin').hide();
            }

            function PopulateIdeasSpinner(): Array<WheelCanvas.PieSlice> {
                var pieSlices: Array<WheelCanvas.PieSlice> = [];
                ColorPicker.ClearSelected();

                for (var i = 0; i < $scope.setIdeasCt; i++) {
                    var idea: Idea = $scope.ideaList[i];
                    pieSlices.push({
                        text: idea.val,
                        color: ColorPicker.RandomColor()
                    });
                }
                return pieSlices;
            }

            function PopulateOptionsSpinner(ideaID: number): Array<WheelCanvas.PieSlice> {
                var pieSlices: Array<WheelCanvas.PieSlice> = [];
                var idea: Idea = $scope.ideaList[ideaID];
                var optCount = Object.keys(idea.opt).length;

                for (var i = 0; i < optCount; i++) {
                    pieSlices.push({
                        text: idea.opt[i],
                        color: ColorPicker.RandomColor()
                    });
                }
                return pieSlices;
            }

            //Initial Page Load
            var dataInit = function () {
                WheelCanvas.BuildWheel(PopulateIdeasSpinner(), true);
            };
            dataInit();
        }]);
    }
    
    function RotateWheel(callback) {
        var counter = 0,
            minumumSpins = 5,
            spins = Math.random() * 50;
        var rotations = spins + (2 * minumumSpins);
        
        var i = setInterval(function () {
            var spinPercent = Math.floor((counter / rotations) * 100);
            counter = counter + CounterIntervalSpeed(spinPercent);//.1 is the speed of the rotation

            var selectedIdea = WheelCanvas.BuildWheel(null, false, counter);

            if (counter > rotations) {
                clearInterval(i);
                callback(selectedIdea);
            }
        }, 10);//10 effects speed also, but mainly controls spin smoothness
    }

    function CounterIntervalSpeed(percentage: number):number {
        var speed;
        if (percentage < 5)
            return .05;
        else if (percentage >= 5 && percentage < 10)
            return .06;
        else if (percentage >= 10 && percentage < 10)
            return .07;
        else if (percentage >= 15 && percentage < 20)
            return .08;
        else if (percentage >= 10 && percentage < 25)
            return .09;
        else if (percentage >= 25 && percentage < 30)
            return .1;
        else if (percentage >= 30 && percentage < 35)
            return .11;
        else if (percentage >= 35 && percentage < 40)
            return .12;
        else if (percentage >= 40 && percentage < 45)
            return .11;
        else if (percentage >= 45 && percentage < 50)
            return .1;
        else if (percentage >= 50 && percentage < 55)
            return .09;
        else if (percentage >= 55 && percentage < 60)
            return .08;
        else if (percentage >= 60 && percentage < 65)
            return .07;
        else if (percentage >= 65 && percentage < 70)
            return .06;
        else if (percentage >= 70 && percentage < 75)
            return .05;
        else if (percentage >= 75 && percentage < 80)
            return .04;
        else if (percentage >= 80 && percentage < 85)
            return .03;
        else if (percentage >= 85 && percentage < 90)
            return .02;
        else if (percentage >= 90 && percentage < 95)
            return .01;
        else if (percentage >= 95 && percentage < 98)
            return .0075;
        else if (percentage >= 98 && percentage < 100)
            return .005;
    }
}