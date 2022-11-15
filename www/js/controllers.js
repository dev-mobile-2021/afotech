angular.module('starter.controllers', ['pascalprecht.translate'])
  // Accueil Controller
  .filter("purger", function () {
    return function (input) {
      return input.replace(/[^\w\s]/gi, "");
    }
  })
  .controller('DashCtrl', function ($scope) {
    console.log('DashCtrl');
    $scope.data = {};
    $scope.data.isconn = localStorage.getItem('isconn');
  })

  .controller('AppCtrl', function ($scope,
    $ionicModal,
    $timeout,
    $state,
    $translate,
    $http,
    $ionicPopup,
    $ionicLoading,
    urlPhp,
    urlJava,
    $cordovaGeolocation,
    abonnement) {
    $scope.menu = true;
    $scope.scroll = false;
    $scope.menutab = false;
    $scope.data = {};


    $scope.checkLocation = function () {
      console.log('-------Position est lance------');
      var options = {
        timeout: 10000,
        enableHighAccuracy: true,
      };
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

      }, err => {
        console.log('Erreur de position', err);
        $ionicPopup.show({
          title: "Informations",
          template: "Veuillez activer la position de votre téléphone pour continuer",
          scope: $scope,
          buttons: [
            {
              text: 'D\'accord',
              type: 'button-energized',
              onTap: function (e) {
                return true;
              }
            },
          ]
        }).then(function (result) {
          if (result) {
            ionic.Platform.exitApp();
          }
        });
      }).catch(function (error) {
        console.log('Erreur de position', error);
      });
    }
    $scope.checkLocation();

    abonnement
      .getAbonnement()
      .success(function (response) {
        console.log('------------------Get abonnement--------------------');
        console.log(response);
      })
      .catch(function (error) {
        console.log(error)
      })




    if (localStorage.getItem('loggedin_name') == null || localStorage.getItem('loggedin_name') == 'null') {
      console.log('non autoriser')
      $scope.scroll = false;
    } else {
      $scope.scroll = true;
      // $scope.menu = true;
      console.log('autoriser')
    }


    if (localStorage.length != 0) {
      $scope.connectedyet = true;
      $scope.sessionloginid = localStorage.getItem('loggedin_id');
      $scope.sessionlogininame = localStorage.getItem('loggedin_name');
      $scope.sessionpassword = localStorage.getItem('loggedin_password');
      $scope.sessionloginiduser = localStorage.getItem('loggedin_iduser');
      $scope.sessionprofile = localStorage.getItem('loggedin_profil')

      sessionStorage.setItem('loggedin_id', $scope.sessionloginid);
      sessionStorage.setItem('loggedin_name', $scope.sessionlogininame);
      sessionStorage.setItem('loggedin_password', $scope.sessionpassword);
      sessionStorage.setItem('loggedin_iduser', $scope.sessionloginiduser);
      sessionStorage.setItem('loggedin_profil', $scope.sessionprofile);

    }
    // Form data for the login modal
    $scope.loginData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });
    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };
    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

  })

  // Login Controller
  .controller('LoginCtrl', function ($scope,
    $http,
    $ionicPopup,
    $state,
    $cordovaSQLite,
    $ionicLoading,
    $ionicHistory,
    $translate,
    urlPhp) {


    $scope.user = {
      login: '',
      password: ''
    };

    $scope.login = function () {
      console.log('abou0')
      // if (window.Connection) {
      console.log('abou1')
      // if (navigator.connection.type == Connection.NONE) {
      console.log('abou2')
      // $translate('alert_header_ofline').then(function (header) {
      //   console.log('abou3')
      //   $translate('alert_content_ofline_home').then(function (content) {

      //   });
      // });

      //   } else {
      var url = urlPhp.getUrl();
      $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 10000 });
      var str = url + "/login1.php?login=" + $scope.user.login + "&password=" + $scope.user.password;
      $http.get(str)
        .success(function (res) { // if login request is Accepted
          $ionicLoading.hide();
          // records is the 'server response array' variable name.
          $scope.user_details = res.records; // copy response values to user-details object.
          console.log($scope.user_details);

          sessionStorage.setItem('loggedin_id',
            $scope.user_details.idUtilisateursPointVent);
          sessionStorage.setItem('loggedin_name', $scope.user_details.login);
          sessionStorage.setItem('loggedin_password', $scope.user_details.password);
          sessionStorage.setItem('loggedin_iduser', $scope.user_details.idutilisateur);
          sessionStorage.setItem('loggedin_profil', $scope.user_details.profil);
          console.log($scope.user_details.profil)
          localStorage.setItem('loggedin_id', $scope.user_details.idUtilisateursPointVent);
          localStorage.setItem('loggedin_name', $scope.user_details.login);
          localStorage.setItem('loggedin_password', $scope.user_details.password);
          localStorage.setItem('loggedin_iduser', $scope.user_details.idutilisateur);
          localStorage.setItem('loggedin_profil', $scope.user_details.profil);
          localStorage.setItem('isconn', true)
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          });
          $translate('alert_connexion_reussi_header').then(function (header) {
            $translate('alert_connexion_reussi_content').then(function (content) {
              var alertPopup = $ionicPopup.alert({
                title: header,
                template: content + $scope.user_details.login + ' !'
              });
            });
          });

          $state.transitionTo('app.bienvenue', {}, {
            reload: true,
            inherit: true,
            notify: true
          });

        }).error(function () { //if login failed
          $ionicLoading.hide();
          $translate('alert_connexion_lost_header').then(function (header) {
            $translate('alert_connexion_lost_content').then(function (content) {
              var alertPopup = $ionicPopup.alert({
                title: header,
                template: content
              });
            });
          });

        });
      //  }
      // }
    };
  })

  .controller('ProspectsCtrl', function ($scope,
    $http,
    $ionicLoading,
    $ionicPopup,
    $cordovaGeolocation,
    ChekConnect,
    $translate,
    $cordovaCamera,
    $ionicModal,
    ProfilUser,
    urlPhp,
    abonnement, $q, $filter, $state, purgerFilter, listeTypechantier) {

    $scope.data = {};
    $scope.data.regionchoisit = null;
    $scope.data.villechoisit = null;
    $scope.data.payschoisit = null;
    $scope.connect = null;
    $scope.data.date = new Date();
    $scope.data.longitude = '0';
    $scope.data.longitudeDepart = '0';
    $scope.data.latitude = '0';
    $scope.data.latitudeDepart = '0';
    $scope.data.profile = 'limite';
    $scope.photo = null;
    $scope.img = '';
    $scope.showphoto = true;
    $scope.data.commentaire = null;
    $scope.data.heureDebut = null;
    $scope.data.heureDepart = null;
    $scope.data.type_chantier = null;
    $scope.data.type_chantier_maison = null;
    $scope.data.listTypeChantier = [];
    $scope.data.typechantierchoisit = null;
    //Variable survey
    $scope.data.survey       = {};
    $scope.data.installation = {};
    $scope.data.depart       = {photos:[]};
    $scope.data.traveaux     = null;
    //localStorage.setItem('fichearrivee',null);
    localStorage.setItem("etape", 0);
    //localStorage.setItem("visite",null)
    $scope.etape = localStorage.getItem("etape");
    var date = new Date();
    var heureArrive                = date.getHours() + ":" + date.getMinutes();
    $scope.data.heureArrive        = heureArrive;

    if ($scope.etape == null || $scope.etape == 'null') {
      $scope.etape = 1;
      console.log("etape")
      console.log($scope.etape)
    } else {
      console.log("etape")
      console.log($scope.etape)
    }

    $scope.abonnement = 1;

    /*$scope.data.outils      = purgerFilter("^..test/$");

        $scope.onChange     = function() {
            $scope.data.outils      = purgerFilter($scope.data.outils);
            
        }*/

        $scope.formatDateNew = function (date, ishour = false, isDate = true) {
          var d = date,
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
            hour = d.getHours();
            minute = d.getMinutes();
            console.log(hour, minute);
    
          if (month.length < 2)
            month = '0' + month;
          if (day.length < 2)
            day = '0' + day;
          var dateFormat       =  [year, month, day].join('-');
          var dateFormatFinale = "";
          if(isDate){
             dateFormatFinale +=  dateFormat;
          }
          if(ishour){
            if(dateFormatFinale!==""){
              dateFormatFinale +=" ";
            }
             dateFormatFinale  += hour+":"+minute;
         }
        
          return dateFormatFinale;
        }

    $scope.valideVisite = function(){
      console.log($scope.data.survey);
      console.log($scope.data.installation);
      console.log($scope.data.depart);
      if($scope.data.depart && $scope.data.depart.photos && $scope.data.depart.photos.length > 0){
        var date = new Date();
        var heureDepart                = date.getHours() + ":" + date.getMinutes();
        $scope.data.depart.heureDepart = heureDepart;

        if($scope.data.installation){
          if($scope.data.installation.heureDebut){
            $scope.data.installation.heureDebut = $scope.formatDateNew($scope.data.installation.heureDebut, true,false);
          }
          if($scope.data.installation.heureFin){
            $scope.data.installation.heureFin   = $scope.formatDateNew($scope.data.installation.heureFin, true,false);
          } 
        }

        if($scope.data.survey){
          if($scope.data.survey.heureDebut){
            $scope.data.survey.heureDebut = $scope.formatDateNew($scope.data.survey.heureDebut, true,false);
          }
          if($scope.data.survey.heureFin){
            $scope.data.survey.heureFin   = $scope.formatDateNew($scope.data.survey.heureFin, true,false);
          } 
        }
      
        var test = {
          "longitude"           : $scope.data.longitude,
          "latitude"            : $scope.data.latitude,
          "adresse"             : $scope.data.adresse,
          "gerant"              : $scope.data.gerant,
          "ville"               : $scope.data.villechoisit.id,
          "idutilisateur"       : localStorage.getItem('loggedin_iduser'),
          "dateajout"           : $scope.formatDate(),
          "telephone"           : "",
          "commentaire"         : $scope.data.commentaire,
          "heureArrivee"        : $scope.data.heureArrive,
          //"heureDepart"         : $scope.data.heureDepart,
          //  "heureDepart"        : $scope.data.heureDepart,
          "typeDeChantier"      : $scope.data.typechantierchoisit.idTypechantier,
          "survey"              : $scope.data.survey,
          "installation"        : $scope.data.installation,
          "departChantier"      : $scope.data.depart,
          "traveaux"            : $scope.data.traveaux,
          }
          console.log('===========================');
          console.log(test);
          $scope.submit('validation', null, test);
      }else{
        $scope.alert('Veuillez d\'abord remplir le formulaire du depart chantier.');
      }
      
    }

    $scope.getListTypeChantier  = function(){
      listeTypechantier.getListTypeChantier().success(function(response){
          // console.log('----------List des types chantiers--------------');
          console.log(response);
          $scope.data.listTypeChantier  = response
      })
    }

    //Get list type chantier
    $scope.getListTypeChantier();

    $scope.suivant = function (etape, signe) {
      // $scope.data.heureDebut     =document.getElementById("heureArrivee").value;
      // $scope.data.heureDepart    =document.getElementById("heureDepart").value;
      //&& $scope.data.traveauchoisit!==null
      if($scope.data.typechantierchoisit!==null && $scope.data.gerant!==null
        && $scope.data.adresse !==null && $scope.data.villechoisit!=null && $scope.data.traveaux !==null){
          if (signe > 0) {
            $scope.etape++;
          } else {
            $scope.etape--;
          }
      }else{
        $scope.alert('Veuillez d\'abord remplir le formulaire principal.');
      }
      console.log($scope.data.traveaux)
  
    }

    $scope.tab = function (tabid) {
      if($scope.etape){
          // if($scope.etape == 1){
          //     $scope.data.survey.heureDebut         =document.getElementById("heureDebutSurvey").value;
          //     $scope.data.survey.heureFin           =document.getElementById("heureFinSurvey").value; 
          // }
          // if($scope.etape == 2){
          //   $scope.data.installation.heureDebut     =document.getElementById("heureDebutInstallation").value;
          //   $scope.data.installation.heureFin       =document.getElementById("heureFinInstallation").value;
          // }
      }
      $scope.etape = tabid;
    //   if(tabid){
    //     if(tabid == 1){
         
    //        if($scope.data.survey.heureDebut){
    //         document.getElementById("heureDebutSurvey").value      = $scope.data.survey.heureDebut;
    //       }
    //       if($scope.data.survey.heureFin){
    //         document.getElementById("heureFinSurvey").value        = $scope.data.survey.heureFin;
    //       }
    //     }
    //     if(tabid == 2){
    //       if($scope.data.installation.heureDebut){
    //         document.getElementById("heureDebutInstallation").value = $scope.data.installation.heureDebut; 
    //       }
    //       if($scope.data.installation.heureFin){
    //         document.getElementById("heureFinInstallation").value   = $scope.data.installation.heureFin;
    //       }
        
    //     }
    // }
    }
    $scope.controleForm = function () {
      console.log('-----_Etape------');
      console.log($scope.etape);
      if ($scope.etape == 1) {
        if ($scope.data.latitude && $scope.data.latitude !== 0 &&
          $scope.data.longitude && $scope.data.longitude !== 0) {
          $scope.etape++;
          localStorage.setItem("etape", $scope.etape);
        } else {
          $scope.alert('Marquer votre arrivée d\'abord avant de passer à cette étape.');
        }
      } else if ($scope.etape == 2) {
        // if($scope.data.outils && $scope.data.outils !== '' && $scope.majFiche !==null){
        localStorage.setItem("etape", 3);
        $scope.etape = 3;
        //  }
      }
    }
    $scope.navigation = function (nav) {

      if (nav < 0) {
        if ($scope.etape !== 1) {
          $scope.etape--;
        }
      } else {
        // $scope.etape++;
        if ($scope.etape == 2) {
          if ($scope.data.outils && $scope.data.outils !== '' && $scope.majFiche !== null) {
            $scope.etape++;
          } else {
            $scope.alert('Valider l\'équipement d\'abord avant de passer à cette étape.');
          }
        } else if ($scope.etape == 1) {
          if ($scope.data.latitude && $scope.data.latitude !== 0 &&
            $scope.data.longitude && $scope.data.longitude !== 0) {
            $scope.etape++;
          } else {
            $scope.alert('Marquer votre arrivée d\'abord avant de passer à cette étape.');
          }
        }

      }

    }

    $scope.alert = function (content) {
      $ionicPopup.show({
        title: '',
        content: content,
        buttons: [

          {
            text: 'OK',
            type: 'button-energized',
            onTap: function (e) {
              return true;
            }
          }]
      })
    }

    abonnement
      .getAbonnement()
      .success(function (response) {
        console.log('------------------Get abonnement--------------------');

        if (response) {
          $scope.abonnement = response[0].abonnement;
          console.log(response);
          console.log(response[0].abonnement);

        }

      })
      .catch(function (error) {
        console.log(error)
      });
    $scope.testProfile = function () {
      $scope.data.profile = ProfilUser.profilUser();
    }
    //Tester la connectiviteee
    $scope.checkConnect = function () {
      $scope.testProfile();
      $scope.connect = ChekConnect.getConnectivite();
    }
    $scope.initCtrl = function () {
      $scope.checkConnect();

    }
    //Tester la connectiviteee
    $scope.initCtrl();
    //Initialiser la liste de regions selon le connectivite
    $scope.initReg = function () {
      if ($scope.connect == true) {

        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0,
          duration: 10000
        });
        console.log('Je suis ici')
        var url = urlPhp.getUrl();
        $http.get(url + "/pays.php")
          .success(function (response) {
            $ionicLoading.hide();
            //$scope.pays = response;
            console.log(response)

            // localStorage.setItem('paysOnline', angular.toJson($scope.pays));
            $scope.listdespays = [];
            for (var i = 0; i < response.length; i++) {
              var pv = { name: response[i].pays, id: response[i].idpays }
              $scope.listdespays.push(pv);
            }
            if ($scope.listdespays.length != 0) {
              $scope.data.payschoisit = $scope.listdespays[0];
              $scope.listDesregionsByPaysID();
            }
          }).catch(function (error) {
            $ionicLoading.hide();
          });


      } else {
        //console.log('eerror connexion')
        $scope.pays = []
        $scope.pays = angular.fromJson(localStorage.getItem('paysOnline'))
        // console.log($scope.pointvente)
        $scope.listdespays = [];
        if ($scope.pays != null) {
          for (var i = 0; i < $scope.pays.length; i++) {
            var pv = { name: $scope.pays[i].pays, id: $scope.pays[i].idpays }
            $scope.listdespays.push(pv);
          }
        }
        if ($scope.data.profile == 'limite') {
          $scope.data.payschoisit = $scope.listdespays[0]
        }
        $scope.listDesregionsByPaysID();
      }
    }
    $scope.listDesregionsByPaysID = function () {

      if ($scope.connect == true) {
        //Recuperer la liste des regions
        console.log($scope.data.payschoisit.id)
        var url = urlPhp.getUrl();
        $http.get(url + "/regionsByPays.php?idpays=" + $scope.data.payschoisit.id)
          .success(function (response) {
            $ionicLoading.hide();
            $scope.region = response;
            //  localStorage.setItem('regionsOnline', angular.toJson($scope.region));
            $scope.listregions = [];
            for (var i = 0; i < response.length; i++) {
              var pv = { name: response[i].region, id: response[i].idregion }
              $scope.listregions.push(pv);
            }

          }).catch(function (error) {
            $ionicLoading.hide();

          });
      } else {
        $scope.region = []
        $scope.region = angular.fromJson(localStorage.getItem('regionsOnline'))
        // console.log($scope.pointvente)
        $scope.listregions = [];
        if ($scope.data.profile == 'super') {
          //   $scope.listregions =  $scope.region;
          for (var i = 0; i < $scope.region.length; i++) {

            var pv = { name: $scope.region[i].region, id: $scope.region[i].idregion }
            $scope.listregions.push(pv);


          }
        } else {

          if ($scope.region != null) {
            for (var i = 0; i < $scope.region.length; i++) {
              if ($scope.region[i].idpays == $scope.data.payschoisit.id) {
                var pv = { name: $scope.region[i].region, id: $scope.region[i].idregion }
                $scope.listregions.push(pv);
              }

            }
          }
        }
      }

    }
    $scope.addImage = function (type) {
      // 2
      $scope.photo = null;
      $ionicLoading.show({
        template: 'Chargement...'
      });
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      // 3
      $cordovaCamera.getPicture(options).then(function (imageData) {
        // 4
        //onImageSuccess(imageData);
        $scope.photo = "data:image/jpeg;base64," + imageData;
        $scope.getRxcui($scope.photo, 'photo');
        $scope.img = imageData;
        if(type=='survey'){
          $scope.data.survey.photo= $scope.photo;
        }else
        if(type=='installation'){
          $scope.data.installation.photo= $scope.photo;
        }else
        if(type=='depart'){
          $scope.data.depart.photos.push($scope.photo);
        }
        $ionicLoading.hide();
      }, function (err) {
        $ionicLoading.hide();
        console.log(err);
      });
    }
    $scope.initvar = function () {
      /*localStorage.setItem('fichearrivee',null);
      localStorage.setItem("visite",null)*/
      $scope.data.adresse = null
      $scope.data.telephone = null
      $scope.data.gerant = null
      $scope.data.latitude = null
      $scope.data.longitude = null
      $scope.data.latitudeDepart = null
      $scope.data.longitudeDepart = null
      $scope.data.villechoisit = null
      $scope.data.date = new Date();
      $scope.data.idutilisateur = localStorage.getItem('loggedin_iduser');
      $scope.data.commentaire = null;
      $scope.data.outils = null;
      $scope.heureArrivee = null;
      $scope.heureDepart = null;
      $scope.photo = null;
      localStorage.setItem("visite", null);
      $scope.majFiche = null;
      var retrievedObject = localStorage.getItem('fichearrivee');
      $scope.majFiche = localStorage.getItem("visite")
      console.log('-----------------Maj--------------');
      var view = JSON.parse(retrievedObject);


      $scope.majFiche = JSON.parse($scope.majFiche);
      if (retrievedObject != 'null' && retrievedObject != null) {

        retrievedObject = JSON.parse(retrievedObject);

        // $scope.data.longitude = retrievedObject.longitude;
        // $scope.data.latitude = retrievedObject.latitude;
        // $scope.data.adresse = retrievedObject.adresse;
        // $scope.data.gerant = retrievedObject.gerant;
        // $scope.data.date = retrievedObject.dateAjout;
        // $scope.data.commentaire = retrievedObject.commentaire;
        // $scope.data.outils = retrievedObject.outils;
        // $scope.heureArrivee = retrievedObject.heureArrivee;
        // $scope.photo = retrievedObject.photo;
        // $scope.data.regionchoisit = retrievedObject.regionchoisi;

      }

      if ($scope.majFiche != 'null' && $scope.majFiche != null) {
        console.log($scope.majFiche);

        // $scope.data.villechoisit = $scope.majFiche.villechoisit ? $scope.majFiche.villechoisit : null;

        // $scope.data.adresse = $scope.majFiche.adresse;
        // $scope.data.commentaire = $scope.majFiche.commentaire;
        // $scope.data.date = $scope.majFiche.dateAjout;
        // $scope.data.gerant = $scope.majFiche.gerant !== 'undefined' && $scope.majFiche.gerant !== null && $scope.majFiche.gerant !== 'null' && $scope.majFiche.gerant !== undefined ? $scope.majFiche.gerant : '';
        // $scope.heureArrivee = $scope.majFiche.heureArrivee;
        // $scope.data.heureDepart = $scope.majFiche.heureDepart;
        // $scope.data.idpointvente = $scope.majFiche.idpointvente;
        // $scope.data.latitude = $scope.majFiche.latitude;
        // $scope.data.latitudeDepart = $scope.majFiche.latitudeDepart;
        // $scope.data.longitude = $scope.majFiche.longitude;
        // $scope.data.longitudeDepart = $scope.majFiche.longitudeDepart;
        // $scope.data.outils = $scope.majFiche.outils;
        // $scope.photo = $scope.majFiche.photo;
        // $scope.data.regionchoisit = $scope.data.villechoisit;

      }



    }
    $scope.getRxcui = function (value, field) {
      var medValue = value;
      console.log(value, field)
      var retrievedObject = localStorage.getItem('fichearrivee');
      console.log(retrievedObject)
      if (retrievedObject != 'null' && retrievedObject != null) {
        retrievedObject = JSON.parse(retrievedObject);
        retrievedObject[field] = value;
        localStorage.setItem('fichearrivee', JSON.stringify(retrievedObject));

      } else {
        var values = {
          field: medValue
        }
        localStorage.setItem('fichearrivee', JSON.stringify(values));
      }

      //$scope.controleForm();
    }
    $scope.$watch('data.regionchoisit', function () {
      $scope.getRxcui($scope.data.regionchoisit, 'regionchoisi');
    });
    $scope.listVillesByRegionID = function () {

      var url = urlPhp.getUrl();

      $http.get(url + "/villeByRegion.php")
        .success(function (response) {
          console.log(response);
          $scope.ville = response;
          $scope.listvilles = [];
          for (var i = 0; i < response.length; i++) {
            var pv = { name: response[i].ville, id: response[i].idville }
            $scope.listvilles.push(pv);
          }

        }).catch(function (error) {
          var pv = { name: "Dakar", id: 1 }
          var pv1 = { name: "Saly", id: 2 }
          $scope.listvilles = [pv, pv1];
        });
    }
    $scope.initvar();
    $scope.listVillesByRegionID();
    $scope.selectables = [
      1, 2, 3
    ];
    $scope.longList = [];
    for (var i = 0; i < 1000; i++) {
      $scope.longList.push(i);
    }

    $scope.getOptTypechantierchoisi = function (option) {
      return option;
    };
    $scope.getOptPays = function (option) {

      return option;
    };
    $scope.getOptRegion = function (option) {
      return option;
    };
    $scope.getOptVille = function (option) {
      return option;
    };

    $scope.shoutLoud = function (newValuea, oldValue) {
      alert("changed from " + JSON.stringify(oldValue) + " to " + JSON.stringify(newValuea));
    };

    $scope.shoutReset = function () {
      alert("value was reset!");
    };

    var intervalGetPosition;

    $scope.jsonPositionsLog = [];
    $scope.isTrackingPosition = false;

    $scope.startTracking = function () {
      console.log('position lance')
      // $scope.getCurrentPosition(); 
      // $scope.getCurrentPositionWeb();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          console.log(position);
          
            $scope.data.latitude = position.coords.latitude;
            $scope.data.longitude = position.coords.longitude;
         
        }, err => {
     
        });
      } else {
     
      }
    }
    $scope.startTracking();

   // $scope.startTracking();

    $scope.getCurrentPositionWeb = function () {
      $ionicLoading.show({
        template: 'Localisation en cours...'
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          $ionicLoading.hide();
          console.log(position);
          $scope.$apply(function () {
            $ionicLoading.hide();
            //  $scope.position = position;
            $scope.saveCurrentPosition(position);
          });
        }, err => {
          $ionicLoading.hide();
        });
      } else {
        $ionicLoading.hide();
      }
    }

    $scope.stopTrackingPosition = function () {
      navigator.geolocation.clearWatch(intervalGetPosition);
    }

    $scope.getCurrentPosition = function () {
      $ionicLoading.show({
        template: 'Localisation en cours...'
      });
      $ionicLoading.hide();
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        console.log(position);

        $scope.saveCurrentPosition(position);

      }, function (error) {
        $ionicLoading.hide();
        if ($scope.connect == true) {
          $scope.oui = '';
          $scope.non = '';
          $translate('alert_button_oui').then(function (oui) {
            $scope.oui = oui;
            console.log(oui);
            $translate('alert_button_non').then(function (non) {
              $scope.non = non;
              //  console.log(non);

              $ionicPopup.show({
                title: '',
                content: '{{ "alert_content_position" | translate }}',
                buttons: [
                  {
                    text: non,
                    type: 'button-assertive',
                    onTap: function (e) {
                      return false;
                    }
                  },
                  {
                    text: oui,
                    type: 'button-energized',
                    onTap: function (e) {
                      return true;
                    }
                  }]
              })
                .then(function (result) {
                  if (!result) {

                  } else {
                    ionic.Platform.exitApp();
                  }
                });
            });

          });


        }
      });
    }


    $scope.saveCurrentPosition = function (position) {
      var date = new Date(position.timestamp)
      console.log(date)

      var date = new Date();
      $scope.heureArrivee = date.getHours() + ":" + date.getMinutes();
      document.getElementById("heureArrivee").value = $scope.heureArrivee;
      // get lat and long
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      $scope.data.latitude = position.coords.latitude;
      $scope.data.longitude = position.coords.longitude;
     // $scope.submit('arrivee');
      $scope.jsonPositionsLog.push({
        latitude: latitude,
        longitude: longitude
      });
      /*window.VerifyAutomaticDateTimeZone.isAutomaticChecked(function(isIt){
       if (isIt == 'true') {


         $scope.heureArrivee = date.getHours()+":"+date.getMinutes();
         document.getElementById("heureArrivee").value =  $scope.heureArrivee;
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
 
        $scope.data.latitude = position.coords.latitude;
        $scope.data.longitude = position.coords.longitude;
        $scope.submit('arrivee');
        $scope.jsonPositionsLog.push({
          latitude: latitude,
          longitude: longitude
        });

         } else {
           
           console.log('ZOne:' + isIt);

           $ionicPopup.show({
             title: 'Erreur',
             content: 'L\'Heure du sytème est incorrect.',
             buttons: [
               {
                 text: 'OK',
                 type: 'button-assertive',
                 onTap: function (e) {
                   return false;
                 }
               },
            ]
           })
             .then(function (result) {
               ionic.Platform.exitApp();
             });
          
         }
     });*/
    }
    initGetLocationListener = function () {
      // init location listener
      intervalGetPosition = navigator.geolocation.watchPosition(function (position) {

        $scope.jsonPositionsLog.push({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        $scope.$apply();
      },
        function (error) {
          //  $scope.submit();
        }, {
        timeout: 3000
      });
    }

    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      /*var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("mapp"), mapOptions);


      google.maps.event.addListenerOnce($scope.map, 'idle', function () {

        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        var infoWindow = new google.maps.InfoWindow({
          content: "Je suis ici !"
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
        });

      });*/

    }, function (error) {
      console.log("Could not get location");
    });

    $scope.getPosition = function () {
      var deferred = $q.defer();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var crd = position.coords;
          console.log('Latitude : ' + crd.latitude);
          console.log('Longitude: ' + crd.longitude);
          deferred.resolve(crd);
        });
      }
      return deferred.promise;
    }

    $scope.formatDate = function () {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    }
    $scope.marquerArriver = function () {
      $scope.controleForm();
    }
    $scope.marquerDepart = function (sens) {
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        console.log(position);
        $scope.submit(sens, position);
      }, function (e) {
        $scope.submit(sens);
      })
    }

    $scope.submit = function (sens, position = null, value = null) {
      $scope.checkConnect();
      var errrSend = '';
      if ($scope.data.latitude == null || $scope.data.latitude == 'null') {
        $scope.data.latitude = "0";
        $scope.data.longitude = "0";
      }

      // $scope.value = {
      //   longitude: $scope.data.longitude,
      //   latitude: $scope.data.latitude,
      //   adresse: $scope.data.adresse,
      //   gerant: "" + $scope.data.gerant,
      //   idutilisateur: localStorage.getItem('loggedin_iduser'),
      //   ville: 1,
      //   region: 1,
      //   pays: $scope.data.payschoisit ? $scope.data.payschoisit.id : null,
      //   dateajout: $scope.formatDate(),
      //   telephone: $scope.data.telephone,
      //   commentaire: $scope.data.commentaire,
      //   outils: $scope.data.outils,
      //   heureArrivee: $scope.heureArrivee,
      //   heureDepart: null,
      //   photo: $scope.photo,
      //   regionchoisi: 1
      // }


      if (sens == 'arrivee') {

        if ($scope.heureArrivee && $scope.heureArrivee != '' && $scope.heureArrivee != null) {
          $ionicPopup.show({
            title: 'Confirmation',
            content: 'Valider l\'arrivée?',
            buttons: [
              {
                text: 'OK',
                type: 'button-assertive',
                onTap: function (e) {
                  return false;
                }
              },
            ]
          })
            .then(function (result) {
              if (!result) {
                console.log("OUI");

              } else {
                console.log("NON");

              }
            });
          localStorage.setItem('fichearrivee', JSON.stringify($scope.value));
        } else {
          $ionicPopup.show({
            title: 'Alert',
            content: 'Veuillez renseigner l\'heure d\'arrivée',
            buttons: [
              {
                text: 'OK',
                type: 'button-assertive',
                onTap: function (e) {
                  return false;
                }
              },
            ]
          })
            .then(function (result) {

            });
        }


      } else {

        var url = urlPhp.getUrl();
        var link = url + '/pointventeccbm.php';

        var date = new Date();

        // var test = {
        //   "longitude": $scope.value.longitude,
        //   "latitude": $scope.value.latitude,
        //   "adresse": $scope.value.adresse,
        //   "gerant": $scope.value.gerant,
        //   "ville": 1,
        //   "idutilisateur": $scope.value.idutilisateur,
        //   "dateajout": $scope.value.dateajout,
        //   "commentaire": $scope.value.commentaire,
        //   "heureArrivee": $scope.value.heureArrivee,
        //   "heureDepart": date.getHours() + ":" + date.getMinutes(),
        //   "outils": $scope.value.outils,
        //   "latitudeDepart": position.coords.latitude,
        //   "longitudeDepart": position.coords.longitude,
        //   "photo": $scope.value.photo,
        //   "telephone": "781586996"
        // }

        if (errrSend == '') {
          $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 10000 });
          var idpointvente = $scope.majFiche ? $scope.majFiche.idpointvente : null;
          test1 = value;
          // var test1 = {
          //   "longitude": $scope.value.longitude,
          //   "latitude": $scope.value.latitude,
          //   "adresse": $scope.value.adresse,
          //   "gerant": $scope.value.gerant,
          //   "ville": 1,
          //   "idutilisateur": $scope.value.idutilisateur,
          //   "dateajout": $scope.value.dateajout,
          //   "telephone": "781586996",
          //   "commentaire": $scope.value.commentaire,
          //   "heureArrivee": $scope.value.heureArrivee,
          //   "heureDepart": date.getHours() + ":" + date.getMinutes(),
          //   "outils": $scope.value.outils,
          //   "latitudeDepart": position.coords.latitude,
          //   "longitudeDepart": position.coords.longitude,
          //   "photo": $scope.value.photo ? $scope.value.photo : "data:image/png;base64,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"
          // }
          // if (!$scope.value.outils && $scope.value.outils == '') {
          //   test1['outils'] = ' ';
          // }

          if (idpointvente) {
            test1.idpointvente = idpointvente;
            if (!$scope.value.commentaire && $scope.value.commentaire == '') {
              test1['commentaire'] = ' ';
            }
            link = url + '/updatepointvente.php';
          }
          console.log('---------LINK-------');
          console.log(link);
          console.log(test1);
          $http.post(link, test1)
            .then(function (res) {
              console.log("Retour insert prospect")
              console.log(res)
              if (res.data) {
                // if (test1.idpointvente) {
                //   localStorage.setItem('fichearrivee', null);
                //   localStorage.setItem("visite", null)
                //   localStorage.setItem("etape", null);
                // }
                // else {
                //   test1.idpointvente = res.data;
                //   localStorage.setItem('visite', JSON.stringify(test1));
                //   $scope.majFiche = test1;
                //   $scope.controleForm();
                // }
                $scope.initvar();
                  $state.transitionTo(
                    "app.mesprospects",
                    {},
                    {
                      reload: true,
                      inherit: true,
                      notify: true,
                    }
                  );

                // if (idpointvente) {
                  
                // } else {
                //   $ionicPopup.show({
                //     title: "Infos",
                //     template: "Outils et Equipements validés.\n Prochaine étape: Terminer votre visite en remplissant le reste du formulaire et cliquer sur Depart chantier.",
                //     scope: $scope,
                //     buttons: [
                //       {
                //         text: 'OK',
                //         type: 'button-energized',
                //         onTap: function (e) {
                //           return true;
                //         }
                //       }]
                //   })
                //   $scope.controleForm();
                // }
              }

              $ionicLoading.hide();

            }).catch(function (error) {
              console.log(error)
              $ionicLoading.hide();
              alert(error);
            });
        } else {
          $ionicPopup.show({
            title: "Infos",
            template: errrSend,
            scope: $scope,
            buttons: [
              {
                text: "Ok",
                type: "button-positive",
              },
            ],
          }).then(function (result) {

          })
        }


      }

      //  }
    }

  })

  .controller('LogoutCtrl', function () {

    sessionStorage.clear();
    localStorage.setItem('loggedin_name', 'null')
    localStorage.setItem('loggedin_password', 'null')

  })

  .controller('MapCtrl', function ($scope, $cordovaGeolocation, $http, urlPhp, ChekConnect,
    $translate,
    ProfilUser,
    $ionicLoading,
    ChekConnect,
    $translate,
    ProfilUser,
    urlJava,
    abonnement) {
    $scope.data.payschoisit = null
    $scope.pvtempon = [];
    $scope.index;
    $scope.size = 0;
    $scope.idregions;
    $scope.data.regionchoisit;
    $scope.data.villechoisit;
    $scope.data.cache = true;
    $scope.abonnement = 1;

    abonnement
      .getAbonnement()
      .success(function (response) {
        console.log('------------------Get abonnement--------------------');

        if (response) {
          $scope.abonnement = response[0].abonnement;
          console.log(response);
          console.log(response[0].abonnement);

        }
      })
      .catch(function (error) {
        console.log(error)
      });
    $scope.getOptPays = function (option) {
      // console.log(option)
      return option;
    };


    $scope.cacheselect = function () {
      if ($scope.data.cache) {
        $scope.data.cache = false;
      } else {
        $scope.data.cache = true;
      }

    }
    $scope.getOptRegion = function (option) {
      //   console.log($scope.data.regionchoisit)
      return option;
    };
    $scope.getOptVille = function (option) {

      return option;
    };
    $scope.testProfile = function () {
      $scope.data.profile = ProfilUser.profilUser();
    }
    $scope.checkConnect = function () {
      $scope.connect = ChekConnect.getConnectivite();
      $scope.testProfile();
    }
    $scope.checkConnect();
    $scope.initMap = function () {
      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map2"), mapOptions);


        //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map, 'idle', function () {

          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: 'img/marker.png'
          });
        });
      });
    }
    $scope.listpays = function () {
      // $scope.data.profil = ProfilUser.profilUser();
      $scope.initMap();
      var pays;
      var listdespays;
      var payschoisit;
      if (window.Connection) {
        if (navigator.connection.type == Connection.NONE) {
          connect = false;

        }
        else {

          connect = true;
          var url = urlPhp.getUrl();
          $http.get(url + "/pays.php")
            .success(function (response) {
              // $ionicLoading.hide();
              console.log(response)
              pays = response;

              $scope.data.listpays = [];
              for (var i = 0; i < response.length; i++) {
                var pv = { name: response[i].pays, id: response[i].idpays, code: response[i].code }
                $scope.data.listpays.push(pv);
              }
              if ($scope.data.listpays.length > 0) {
                $scope.data.payschoisit = $scope.data.listpays[0];
                $scope.listPvByPays($scope.data.payschoisit);

              }

            }).catch(function (error) {
              // $ionicLoading.hide();
              console.log(error)
            });

        }
      }

    }
    $scope.listDesregionsByPaysID = function () {

      if ($scope.connect == true) {
        //Recuperer la liste des regions
        var url = urlPhp.getUrl();
        $http.get(url + "/regionsByPays.php?idpays=" + $scope.data.payschoisit.id)
          .success(function (response) {
            $ionicLoading.hide();
            $scope.region = response;
            //  localStorage.setItem('regionsOnline', angular.toJson($scope.region));
            $scope.listregions = [];
            for (var i = 0; i < response.length; i++) {
              var pv = { name: response[i].region, id: response[i].idregion }
              $scope.listregions.push(pv);
            }

          }).catch(function (error) {
            $ionicLoading.hide();

          });
      }
    }
    $scope.listVillesByRegionID = function () {
      if ($scope.connect == true) {
        //Recuperer la liste des villes
        $scope.refreshville();
        var url = urlPhp.getUrl();
        $http.get(url + "/villeByRegion.php?idregion=" + $scope.data.regionchoisit.id)
          .success(function (response) {
            $ionicLoading.hide();
            $scope.ville = response;
            // localStorage.setItem('villesOnline', angular.toJson($scope.ville));
            $scope.listvilles = [];
            for (var i = 0; i < response.length; i++) {
              var pv = { name: response[i].ville, id: response[i].idville }
              $scope.listvilles.push(pv);
            }
            //    console.log($scope.listvilles)
          }).catch(function (error) {
            $ionicLoading.hide();
          });
      } else {

      }

    }
    $scope.refreshville = function () {
      $scope.initMap();
      $scope.listvilles = null
      $scope.data.villechoisit = null
    }

    //$scope.listpays();
    $scope.listpointdevnte = function () {
      $scope.pvtempon = [];
      $scope.data.pvchoisit = null;
      var url = urlPhp.getUrl();
      var link = url + "/yup/mespointVente"

      //   console.log(user)
      $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 10000 });
      $http.get(url + "/pointventesutilisateur.php?idutilisateur=" + localStorage.getItem('loggedin_iduser'))
        .success(function (response) {
          $ionicLoading.hide();
          console.log('---------Points de ventes pour le maps-----');
          console.log(response)
          var options = {
            timeout: 10000,
            enableHighAccuracy: true
          };
          if (response && response.length > 0) {

            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

              var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

              var mapOptions = {
                center: latLng,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };

              $scope.map = new google.maps.Map(document.getElementById("map2"), mapOptions);

              //Wait until the map is loaded
              google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                var marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: latLng,
                  icon: 'img/marker.png'
                });
                $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 10000 });
                response.forEach(function (pv) {
                  if (pv.latitude !== 0 && pv.longitude !== 0 && pv.latitude !== '' && pv.longitude !== '' && pv.latitude !== null && pv.longitude !== null) {
                    var marker = new google.maps.Marker({
                      map: $scope.map,
                      animation: google.maps.Animation.DROP,
                      position: new google.maps.LatLng(pv.latitude, pv.longitude),
                      icon: 'img/map-marker.png'
                    });
                    var heureDepart   = pv.departChantier  && pv.departChantier.heureDepart ? pv.departChantier.heureDepart : '';

                    var infoWindow = new google.maps.InfoWindow({
                      content:
                        "Chef de chantier: " + pv.gerant
                        + "<br/>Adresse: " + pv.adresse
                        + "<br/>heure d'arrivée: " + pv.heureArrivee
                        + "<br/>heure de départ: " + heureDepart

                    });

                    google.maps.event.addListener(marker, 'click', function () {
                      infoWindow.open($scope.map, marker);
                    })

                  }

                });
                $ionicLoading.hide();


              });
            });
          }


          //$scope.pvs = response;

        }).catch(function (error) {
          $ionicLoading.hide();
          alert(error);
        });




    }
    $scope.listpointdevnte();
    //Charger les points par pays sur la carte
    $scope.listPvByPays = function () {
      var url = urlPhp.getUrl();
      $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 10000 });
      $http.get(url + '/pointdeventByPays.php?idpays=' + $scope.data.payschoisit.id).then(function (res) {

        $scope.pointventes = angular.fromJson(res.data).sort();
        console.log("Pays")
        console.log($scope.pointventes)
        //Charger la carte
        $scope.initMapPv($scope.pointventes);
        $scope.listDesregionsByPaysID();
      });
    }
    //Charger les points par region sur la carte
    $scope.listPvByRegion = function () {
      var url = urlPhp.getUrl();
      $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 10000 });
      $http.get(url + '/pointdeventByRegion.php?idregion=' + $scope.data.regionchoisit.id).then(function (res) {

        $scope.pointventes = angular.fromJson(res.data).sort();
        console.log("Regions")
        console.log($scope.pointventes)
        //Charger la carte
        $scope.initMapPv($scope.pointventes);
        $scope.listVillesByRegionID();
      });
    }

    $scope.initMapPv = function (listpointvente) {
      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map2"), mapOptions);

        google.maps.event.addListenerOnce($scope.map, 'idle', function () {

          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: 'img/marker.png'
          });

          if (listpointvente.length > 0) {
            listpointvente.forEach(function (pv) {
              var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(pv.latitude, pv.longitude),
                icon: 'img/map-marker.png'
              });

              var infoWindow = new google.maps.InfoWindow({
                content: "Point: " + pv.gerant + "<br/>Telephone: " + pv.telephonegerant + "<br/>Longitude: " + pv.longitude + "<br/>Latitude: " + pv.latitude
              });

              google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
              })
              $ionicLoading.hide();
            });
          } else {
            $ionicLoading.hide();
          }
          $ionicLoading.hide();
        });
      });
    }
    $scope.listPvPhp = function () {
      var url = urlPhp.getUrl();
      $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 10000 });
      $http.get(url + '/pointventesutilisateurmap.php?idville=' + $scope.data.villechoisit.id + "&idutilisateur=" + localStorage.getItem('loggedin_id')).then(function (res) {
        var options = {
          timeout: 10000,
          enableHighAccuracy: true
        };

        $scope.pointventes = angular.fromJson(res.data).sort();

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          var mapOptions = {
            center: latLng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          $scope.map = new google.maps.Map(document.getElementById("map2"), mapOptions);


          //Wait until the map is loaded
          google.maps.event.addListenerOnce($scope.map, 'idle', function () {

            var marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              position: latLng,
              icon: 'img/marker.png'
            });
            console.log($scope.pointventes)
            $scope.pointventes.forEach(function (pv) {
              var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(pv.latitude, pv.longitude),
                icon: 'img/map-marker.png'
              });

              var infoWindow = new google.maps.InfoWindow({
                content: "Point: " + pv.gerant + "<br/>Telephone: " + pv.telephonegerant + "<br/>Longitude: " + pv.longitude + "<br/>Latitude: " + pv.latitude
              });

              google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
              })
              $ionicLoading.hide();
            });


          });
        });
      });
    }
  })
  .controller('MesprospectsCtrl', function ($scope,
    $http, $ionicLoading, ChekConnect,
    $ionicPopup, $translate, urlPhp, abonnement, $state) {
    $scope.data = {};
    $scope.data.regionchoisit = null;
    $scope.data.villechoisit = null;
    $scope.data.payschoisit = null;
    $scope.data.datefilter = null;
    $scope.connect = null;
    $scope.data = {};
    $scope.photos = "http://htsoftdemo.com/apipmi/img/1437478472_1600619163.jpg";

    $scope.abonnement = 1;
    abonnement
      .getAbonnement()
      .success(function (response) {
        console.log('------------------Get abonnement--------------------');

        if (response) {
          $scope.abonnement = response[0].abonnement;
          console.log(response);
          console.log(response[0].abonnement);

        }
      })
      .catch(function (error) {
        console.log(error)
      });
    $scope.$watch('datefilter', function (newValue, oldValue) {
      console.log('-----------------La valeur de la dte a change-----------------');
      console.log(newValue);
    });
    $scope.majFiche = function (item) {
      localStorage.setItem("visite", JSON.stringify(item))
      $state.transitionTo(
        "app.prospects",
        {},
        {
          reload: true,
          inherit: true,
          notify: true,
        }
      );
    }

    $scope.filterByDate = function () {
      if ($scope.data.villechoisit) {
        $scope.lispvPhp();
      } else {
        $scope.lispvPhp();
      }
    }

  

    //Tester la connectiviteee
    $scope.checkConnect = function () {
      $scope.connect = ChekConnect.getConnectivite();
    }
    //Tester la connectiviteee
    $scope.getOptPays = function (option) {

      return option;
    };
    $scope.getOptVille = function (option) {

      return option;
    };
    $scope.getOptRegion = function (option) {

      return option;
    };

    $scope.initReg = function () {
      if ($scope.connect == true) {

        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0,
          duration: 10000
        });
        console.log('Je suis ici')
        var url = urlPhp.getUrl();
        $http.get(url + "/pays.php")
          .success(function (response) {
            $ionicLoading.hide();
            //$scope.pays = response;
            console.log(response)

            // localStorage.setItem('paysOnline', angular.toJson($scope.pays));
            $scope.listdespays = [];
            for (var i = 0; i < response.length; i++) {
              var pv = { name: response[i].pays, id: response[i].idpays }
              $scope.listdespays.push(pv);
            }
            if ($scope.listdespays.length != 0) {
              $scope.data.payschoisit = $scope.listdespays[0];
              $scope.lispvByBays();

            }
          }).catch(function (error) {
            $ionicLoading.hide();
          });

      } else {

      }
    }

    $scope.listDesregionsByPaysID = function () {

      if ($scope.connect == true) {
        //Recuperer la liste des regions
        console.log($scope.data.payschoisit.id)
        var url = urlPhp.getUrl();
        $http.get(url + "/regionsByPays.php?idpays=" + $scope.data.payschoisit.id)
          .success(function (response) {
            $ionicLoading.hide();
            $scope.region = response;
            //  localStorage.setItem('regionsOnline', angular.toJson($scope.region));
            $scope.listregions = [];
            for (var i = 0; i < response.length; i++) {
              var pv = { name: response[i].region, id: response[i].idregion }
              $scope.listregions.push(pv);
            }

          }).catch(function (error) {
            $ionicLoading.hide();

          });
      } else {
        $scope.region = []
        $scope.region = angular.fromJson(localStorage.getItem('regionsOnline'))
        // console.log($scope.pointvente)
        $scope.listregions = [];
        if ($scope.data.profile == 'super') {
          //   $scope.listregions =  $scope.region;
          for (var i = 0; i < $scope.region.length; i++) {

            var pv = { name: $scope.region[i].region, id: $scope.region[i].idregion }
            $scope.listregions.push(pv);


          }
        } else {

          if ($scope.region != null) {
            for (var i = 0; i < $scope.region.length; i++) {
              if ($scope.region[i].idpays == $scope.data.payschoisit.id) {
                var pv = { name: $scope.region[i].region, id: $scope.region[i].idregion }
                $scope.listregions.push(pv);
              }

            }
          }
        }
      }

    }
    $scope.listVillesByRegionID = function () {

      //Recuperer la liste des villes
      var url = urlPhp.getUrl();
      $http.get(url + "/villeByRegion.php")
        .success(function (response) {
          $ionicLoading.hide();
          $scope.ville = response;
          // localStorage.setItem('villesOnline', angular.toJson($scope.ville));
          $scope.listvilles = [];
          for (var i = 0; i < response.length; i++) {
            var pv = { name: response[i].ville, id: response[i].idville }
            $scope.listvilles.push(pv);
          }

        }).catch(function (error) {
          $ionicLoading.hide();
        });


    }
    $scope.listVillesByRegionID();
    $scope.initReg();
    $scope.lispvByBays = function () {
      var errorList = '';
      errorList = $scope.data.villechoisit ? '' : 'Veuillez choisir une ville';
      if (errorList == '') {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 3000 });
        var url = urlPhp.getUrl();
        $http.get(url + "/pointdeventByPays.php?idpays=" + $scope.data.payschoisit.id + "&date=" + $scope.data.datefilter)
          .success(function (response) {
            $ionicLoading.hide();
            console.log(response)
            $scope.pvs = response;
            $scope.listDesregionsByPaysID();
          }).catch(function (error) {
            $ionicLoading.hide();
            alert(error);
          });
      } else {
        $ionicPopup.show({
          title: "Infos",
          template: errorList,
          scope: $scope,
          buttons: [
            {
              text: "Ok",
              type: "button-positive",
            },
          ],
        }).then(function (result) {

        })
      }

    }
    $scope.lispvByVile = function () {
      $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 3000 });
      var url = urlPhp.getUrl();
      $http.get(url + "/pointdeventByRegion.php?idville=" + $scope.data.villechoisit.id + "&date=" + $scope.data.datefilter)
        .success(function (response) {
          $ionicLoading.hide();
          console.log(response)
          $scope.pvs = response;

        }).catch(function (error) {
          $ionicLoading.hide();
          alert(error);
        });
    }
    $scope.formatDate = function () {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    }
    $scope.lispvPhp = function () {
      var url = urlPhp.getUrl();
      var link =url + "/pointventesutilisateur.php";
      var test1 = {
        "idutilisateur": localStorage.getItem('loggedin_iduser')
      }
      $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0, duration: 3000 });
      // $http.post(link, test1)
      //       .then(function (res) {

      //       })
      $http.get(url + "/pointventesutilisateur.php?idutilisateur=" + localStorage.getItem('loggedin_iduser'))
        .success(function (response) {
          $ionicLoading.hide();
          console.log(response)
           $scope.pvs = response;
        })
    }
    $scope.lispvPhp();

  })
  .factory('ChekConnect', function () {
    var connect;

    return {
      getConnectivite: function () {
        if (window.Connection) {
          if (navigator.connection.type == Connection.NONE) {
            connect = false;
          }
          else {
            connect = true;
          }
        }
        return connect;
      }
    }
  })
  .factory('abonnement', function ($http, urlPhp) {
    return {
      getAbonnement: function () {
        var url = urlPhp.getUrl();
        return $http.get(url + '/abonnement.php');
      }
    }
  })
  .factory('listeTypechantier', function ($http, urlPhp) {
    return {
      getListTypeChantier: function () {
        var url = urlPhp.getUrl();
        return $http.get(url + '/listeTypechantier.php');
      }
    }
  })
  .factory('urlPhp', function () {
    return {
      getUrl: function () {
        return 'http://test-test.h-tsoft.com/apiafotech';
        //return "http://htsoftdemo.com/apipmi";
        //return "http://192.168.1.34/CCBM-serveur";
        //  return "http://mob-test.yosard.com/webservice";
        // return "http://mob.yosard.com:89/webservice";
      }
    }
  })
  .factory('urlJava', function () {
    var connect;

    return {
      getUrl: function () {
        return "http://v-beta.yosard.com:8080/yup/rest";
        // return "http://www.yosard.com:8080/yup/rest";
      }
    }
  })
  .factory('ProfilUser', function () {
    var profil = 'limite';
    //$scope.data.profile = sessionStorage.getItem("")
    return {
      profilUser: function () {

        if (sessionStorage.getItem('loggedin_profil') == 'Codir YUP Mgt' || sessionStorage.getItem('loggedin_profil') == 'Direction Commerciale YUP Mgt'
          || sessionStorage.getItem('loggedin_profil') == 'Marketing YUP Mgt' || sessionStorage.getItem('loggedin_profil') == 'Call Center YUP Mgt'
          || sessionStorage.getItem('loggedin_profil') == 'Administrateur Maintenance') {
          // $scope.data.profile = 'super';
          profil = 'super';
        }
        return profil;
      }
    }
  })
