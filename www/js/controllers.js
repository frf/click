angular.module('starter.controllers', [])

    .controller("LoginController", function($scope, $ionicHistory, $firebaseAuth, $location) {

        console.log('LOGIN');

        $scope.login = function(username, password) {
            var fbAuth = $firebaseAuth(fb);
            fbAuth.$authWithPassword({
                email: username,
                password: password
            }).then(function(authData) {
                $location.path("/tab/dash");
            }).catch(function(error) {
                console.error("ERROR: " + error);
            });
        }

        $scope.logout = function() {
            console.log('SAIR');

            console.log(fb.unauth());

            $ionicHistory.clearHistory();

            $location.path("/tab/login");


        }


        $scope.register = function(username, password) {
            var fbAuth = $firebaseAuth(fb);
            fbAuth.$createUser({email: username, password: password}).then(function() {
                return fbAuth.$authWithPassword({
                    email: username,
                    password: password
                });
            }).then(function(authData) {
                $location.path("/tab/dash");
            }).catch(function(error) {
                console.error("ERROR " + error);
            });
        }

    })
.controller('DashCtrl', function($scope, $ionicHistory, $location, Chats){

        $ionicHistory.clearHistory();

        fbAuth = fb.getAuth();

        if(fbAuth != null) {

            $scope.chats = Chats.all();
            $scope.remove = function (chat) {
                Chats.remove(chat);
            };

        }else{
            $location.path("/home");
        }
})
    .controller('FotoCtrl', function($scope){

    }).controller('HomeController', function($scope){

    }).controller('SecureController',  function($scope, $ionicHistory, $firebaseArray, $cordovaCamera) {

        $ionicHistory.clearHistory();

        $scope.images = [];

        var fbAuth = fb.getAuth();
        if(fbAuth) {
            var userReference = fb.child("users/" + fbAuth.uid);
            var syncArray = $firebaseArray(userReference.child("images"));
            $scope.images = syncArray;
        } else {
            $state.go("login");
        }

        $scope.upload = function() {
            var options = {
                quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                syncArray.$add({image: imageData}).then(function() {
                    alert("Imagem enviada com sucesso");
                });
            }, function(error) {
                console.error(error);
            });
        }

    }).controller('imageController', function($scope, $cordovaCamera, $cordovaFile) {
        // 1
        $scope.images = [];

        $scope.addImage = function() {
            // 2
            var options = {
                destinationType : Camera.DestinationType.FILE_URI,
                sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
            };

            // 3
            $cordovaCamera.getPicture(options).then(function(imageData) {

                // 4
                onImageSuccess(imageData);

                function onImageSuccess(fileURI) {
                    createFileEntry(fileURI);
                }

                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }

                // 5
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;

                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                            fileEntry.copyTo(
                                fileSystem2,
                                newName,
                                onCopySuccess,
                                fail
                            );
                        },
                        fail);
                }

                // 6
                function onCopySuccess(entry) {
                    $scope.$apply(function () {
                        $scope.images.push(entry.nativeURL);
                    });
                }

                function fail(error) {
                    console.log("fail: " + error.code);
                }

                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i=0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }

            }, function(err) {
                console.log(err);
            });
        }

        $scope.urlForImage = function(imageName) {
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            return trueOrigin;
        }

        $scope.sendEmail = function() {
            // 1
            var bodyText = "<h2>Look at this images!</h2>";
            if (null != $scope.images) {
                var images = [];
                var savedImages = $scope.images;
                for (var i = 0; i < savedImages.length; i++) {
                    // 2
                    images.push("" + $scope.urlForImage(savedImages[i]));
                    // 3
                    images[i] = images[i].replace('file://', '');
                }

                // 4
                window.plugin.email.open({
                        to:          ["fabio@fabiofarias.com.br"], // email addresses for TO field
                        cc:          Array, // email addresses for CC field
                        bcc:         Array, // email addresses for BCC field
                        attachments: images, // file paths or base64 data streams
                        subject:    "Just some images", // subject of the email
                        body:       bodyText, // email body (for HTML, set isHtml to true)
                        isHtml:    true, // indicats if the body is HTML or plain text
                    }, function () {
                        console.log('email view dismissed');
                    },
                    this);
            }
        }
    }).controller("FotoController", function($scope) {

        $scope.images = [];

        $scope.loadImages = function() {
            for(var i = 0; i < 100; i++) {
                $scope.images.push({id: i, src: "http://placehold.it/50x50"});
            }
        }

})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
