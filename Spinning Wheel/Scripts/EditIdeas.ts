module EditIdeas {

    //build in logic for Edit Ideas page.
    //Not sure if this will build in Angular? Maybe?

    export function LoadAngularModule() {
        var spinningWheelApp = angular.module('spinningWheelApp', []);
        spinningWheelApp.controller('editJSONController', ['$scope', function ($scope) {
            var ideaListJSON = JSON.parse($('#hdnData').val());

            //Scope Variables
            $scope.ideaList = ideaListJSON;
            $scope.setIdeasCt = function () {
                return $scope.ideaList.length;
            }
            $scope.btnToggleAllValue = "Collapse All";
            $scope.ideasListHTML = '';
            $scope.ideasToBeDeleted = [];

            $scope.saveIdeaList = function () {
                $.ajax({
                    url: '/Options/EditIdeasData',
                    data: { ideasJSON: JSON.stringify($scope.ideaList) }
                });
            };

            $scope.toggleAll = function () {
                if ($scope.btnToggleAllValue === "Collapse All") {
                    $scope.btnToggleAllValue = "Expand All";
                    $('#lstJSONData').children('ul:not(:last-child)').children('li').hide().children('ul').hide();

                    $('#lstJSONData').find('img').each(function (i, e) {
                        var element = $(e);
                        if (element.hasClass('minusIcon')) {
                            element.removeClass('minusIcon');
                            element.addClass('plusIcon');
                        }
                    });
                }
                else if ($scope.btnToggleAllValue === "Expand All") {
                    $scope.btnToggleAllValue = "Collapse All";
                    $('#lstJSONData').children('ul:not(:last-child)').children('li').show().children('ul').show();

                    $('#lstJSONData').find('img').each(function (i, e) {
                        var element = $(e);
                        if (element.hasClass('plusIcon')) {
                            element.removeClass('plusIcon');
                            element.addClass('minusIcon');
                        }
                    });
                }
            };

            $scope.addOptVal = function (e) {
                var element = $(e.currentTarget);

                //Page click logic to cancel the save. Also built in logic to 
                //disable the other buttons while adding a new opt val
                $(document).click(function () {
                    if (e.currentTarget.style.display == 'none') {
                        element.show();
                        addOptInserted();
                    } else {
                        element.hide();
                        $('#lstJSONData').find('.btnAddOpt').prop("disabled", true);
                        $('#lstJSONData').find('#btnAddIdea').prop("disabled", true);
                        $('#btnEditAllVals').prop("disabled", true);
                        element.parent().find('.addOpt').show();
                        element.parent().find('.addOpt').css('display', 'inline');
                        element.parent().find('.addOpt').find('input[type=textbox]').focus();
                    }
                });
                
                element.parent().find(".addOpt").click(function (e) {
                    e.stopPropagation(); 
                    return false;        
                });
            };

            $scope.insertOptVal = function (e, ideaNum) {
                var element = $(e.currentTarget);
                var newOptVal = element.parent().find('input[type=textbox]').val().trim();

                if (newOptVal.length === 0) {
                    alert('must enter value'); //TODO: Need to create an error page to handle this logic
                } else {
                    var error = false,
                        idea = $scope.ideaList[ideaNum];
                    var optCt = Object.keys(idea.opt).length;
                    
                    for (var i = 0; i < optCt; i++) { //Error checking for idea already on list
                        if (idea.opt[i] == newOptVal) {
                            alert('Option value already exists for this idea.');
                            error = true;
                            break;
                        }
                    }

                    if (error)
                        return;

                    //Add new option to List
                    idea.opt[optCt] = newOptVal;
                    $scope.saveIdeaList();

                    //Update Page Values
                    element.parent().parent().parent().find('li').last().before('<li id=lstOpt_' + ideaNum + '_' + optCt + '" class="editOpt">' + newOptVal + '</li>');
                    addOptInserted();

                    //Toggle back to 'add opt...'
                    toggleBtnAdd(element);
                }
            }

            $scope.addNewIdea = function (e) {
                var element = $(e.currentTarget);

                $(document).click(function () {
                    if (e.currentTarget.style.display == 'none') {
                        element.show();
                        $('#lstJSONData').find('.btnAddOpt').prop("disabled", false);
                        $('#btnEditAllVals').prop("disabled", false);
                        $('#addIdea').hide();
                        $(document).unbind('click');
                    } else {
                        element.hide();
                        $('#lstJSONData').find('.btnAddOpt').prop("disabled", true);
                        $('#btnEditAllVals').prop("disabled", true);
                        $('#addIdea').show();
                    }
                });

                element.parent().find("#addIdea").click(function (e) {
                    e.stopPropagation();
                    return false;
                });
            };

            $scope.insertIdeaVal = function (e) {
                var element = $(e.currentTarget);
                var newIdeaVal = element.parent().find('input[type=textbox]').val().trim();

                if (newIdeaVal.length === 0) {
                    alert('must enter value'); //TODO: Need to create an error page to handle this logic
                } else {
                    var error = false,
                        ideaCt = $scope.ideaList.length;

                    for (var i = 0; i < ideaCt; i++) { //Error checking for idea already on list
                        if ($scope.ideaList[i].val == newIdeaVal) {
                            alert('Option value already exists for this idea.');
                            error = true;
                            break;
                        }
                    }

                    if (error)
                        return;

                    //Add new idea to List
                    $scope.ideaList.push({
                        val: newIdeaVal,
                        opt: {}
                    });

                    $scope.saveIdeaList();

                    //Update Page Values
                    var seedVal = 0;//get next idea seed value
                    $('*[id*=lstJSONData_]').each(function (i, e) {
                        var maxLstItem:number = parseInt($(e).attr('id').replace('lstJSONData_', ''));
                        if (maxLstItem >= seedVal)
                            seedVal = maxLstItem + 1;
                    });
                    
                    var newIdeaHTML = '<ul>' + AddToggleElement() + ' ' + seedVal + '<li id="lstJSONData_' + seedVal + '" class="editVal"> val: ' + newIdeaVal + ' </li>';
                    newIdeaHTML = newIdeaHTML + '<li>opt: ' + AddToggleElement() + '<ul>';
                    newIdeaHTML = newIdeaHTML +'<li><button id="btnAddOpt_' + seedVal + '" class="btnAddOpt" ng-click="addOptVal($event)">add opt...</button><div class="addOpt"><input type="textbox" /><button ng-click="insertOptVal($event, ' + seedVal + ')">Save</button></div></li></ul></li></ul>';
                    $('#lstJSONData').find('ul').last().before(newIdeaHTML);

                    addOptInserted();
                    //Toggle back to 'add idea...'
                    toggleBtnAdd(element);

                    //bind to view
                    $scope.ideasListHTML = $('#lstJSONData').html();
                }
            }

            $scope.editAllVals = function () {
                var list = $('#lstJSONData');

                //show deleteIdeaIcon
                list.find('.deleteIdeaIcon').show();


                //replace all editable values with textbox
                list.find('.editVal').each(function (i, e) {
                    var value = $(this).text().split(':')[1].trim();
                    $(this).text('');
                    $(e).append('val: <input type="textbox" value="' + value + '" />');
                });

                list.find('.editOpt').each(function (i, e) {
                    var value = $(this).text().trim();
                    $(this).text('');
                    $(e).append('<input type="textbox" value="' + value + '" />');
                });
                
                //disable all add opt/idea
                list.find('button').prop('disabled', true);
                
                //Show/Hide buttons
                $('#btnEditAllVals').hide();
                $('#btnSaveAllVals').show();
            }

            $scope.saveAllVals = function () {
                var list = $('#lstJSONData');

                //hide deleteIdeaIcon
                list.find('.deleteIdeaIcon').hide();

                //save all edited values
                list.find('.editVal').each(function (i, e) {
                    var ideaListNum = parseInt($(e).attr('id').replace('lstJSONData_', ''));
                    var cont = true;

                    //check if item is planned to be deleted
                    if ($.inArray(ideaListNum, $scope.ideasToBeDeleted))
                        cont = false;

                    if (cont) {
                        var value = $(e).find('input').val().trim();
                        $(e).text('val: ' + value);
                        $(e).find('input').remove();

                        //Update ideaList to prepare for save
                        $scope.ideaList[ideaListNum].val = value;
                    }
                });

                list.find('.editOpt').each(function (i, e) {
                    
                        var value = $(e).find('input').val().trim();
                        $(e).text(value);
                        $(e).find('input').remove();

                        //Update ideaList to prepare for save
                        var listOptIDs = $(e).attr('id').replace('lstOpt_', ''),
                            ideaListNum = parseInt(listOptIDs.split('_')[0]),
                            optListNum = parseInt(listOptIDs.split('_')[1]);
                        $scope.ideaList[ideaListNum].opt[optListNum] = value;
                    
                });

                //Remove to be deleted Ideas from List
                for (var a = 0; a < $scope.ideasToBeDeleted.length; a++) {
                    $scope.ideaList.splice(a, 1);
                }
                $scope.ideasToBeDeleted = [];

                //Save
                $scope.saveIdeaList();

                //enable all add opt/idea
                list.find('button').prop('disabled', false);

                //Show/Hide buttons
                $('#btnEditAllVals').show();
                $('#btnSaveAllVals').hide();
            }

            $scope.deleteIdea = function (e) {
                var deleteIcon = $(e.currentTarget);
                var ideaNum:number = parseInt(deleteIcon.attr('ideaNum'));

                //remove Idea from UI
                deleteIcon.parent().remove();

                //remove Idea from ideaList Object
                $scope.ideasToBeDeleted.push(ideaNum);
            }

            //Initial Page Load
            var dataInit = function () {
                var ideasListHTML = '';
                for (var i = 0; i < $scope.setIdeasCt(); i++) {
                    var idea: Idea = $scope.ideaList[i],
                        optCt = Object.keys(idea.opt).length;

                    ideasListHTML = ideasListHTML + '<ul>' + AddToggleElement() + ' ' + i + '<img src="/Images/DeleteRed.png" ideaNum="' + i + '" class="deleteIdeaIcon" ng-click="deleteIdea($event)" /><li id="lstJSONData_' + i + '" class="editVal"> val: ' + idea.val + ' </li>';
                    ideasListHTML = ideasListHTML + '<li>opt: ' + AddToggleElement() + '<ul>';

                    for (var a = 0; a < optCt; a++)
                        ideasListHTML = ideasListHTML + '<li id="lstOpt_' + i + '_' + a + '" class="editOpt">' + idea.opt[a] + '</li>';

                    ideasListHTML = ideasListHTML + '<li><button id="btnAddOpt_' + i + '" class="btnAddOpt" ng-click="addOptVal($event)">add opt...</button><div class="addOpt"><input type="textbox" /><button ng-click="insertOptVal($event, ' + i + ')">Save</button></div></li></ul></li></ul>';
                }
                ideasListHTML = ideasListHTML + '<ul><li><button id="btnAddIdea" ng-click="addNewIdea($event)">add idea...</button><div id="addIdea">Idea val: <input type="textbox" /><button ng-click="insertIdeaVal($event)">Save</button></div></li></ul>';

                $scope.ideasListHTML = ideasListHTML;
            };
            dataInit();
        }]);

        spinningWheelApp.directive('dynamic', function ($compile) {
            return {
                restrict: 'A',
                replace: true,
                link: function (scope, ele, attrs) {
                    scope.$watch(attrs.dynamic, function (html) {
                        ele.html(html);
                        $compile(ele.contents())(scope);
                    });
                }
            };
        });
        
    }

    function addOptInserted() {
        $('#lstJSONData').find('.btnAddOpt').prop("disabled", false);
        $('#lstJSONData').find('#btnAddIdea').prop("disabled", false);
        $('#btnEditAllVals').prop("disabled", false);
        $('#lstJSONData').find('.addOpt').hide();
        $(document).unbind('click');
    }

    function toggleBtnAdd(e) {
        e.parent().hide();
        e.parent().parent().find('input[type=textbox]').val('');
        e.parent().parent().find('button').show();
    }

    function AddToggleElement(): string {
        return '<img class="minusIcon" onclick="EditIdeas.ToggleList(event)" />';
    }

    export function ToggleList(e) {
        var currListImg = $(e.currentTarget);

        if (currListImg.hasClass('minusIcon')) {
            currListImg.removeClass('minusIcon');
            currListImg.addClass('plusIcon');
            currListImg.parent().children().not('img').hide();
        } else if (currListImg.hasClass('plusIcon')) {
            currListImg.removeClass('plusIcon');
            currListImg.addClass('minusIcon');
            currListImg.parent().children().not('img').show();
        }
    }
}