var paisOperator = angular.module("paisOperator", ['ngRoute', 'ngCookies', 
	'angularjs-dropdown-multiselect', 'angularCharts', 
	'ngMagnify', 'nvd3', 'ngSanitize','pascalprecht.translate', 'ServerService', 'cgBusy', 'ngFileUpload', 'LocalStorageModule']);


paisOperator.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://srv*.assets.example.com/**'
  ]);
});

paisOperator.run(function($rootScope, $translate) {
        $rootScope.translate = function(lang) {
			     $translate.use(lang);
        };
        $rootScope.getLanguage = function () {
          return $translate.use();
        };
});



paisOperator.config(function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.translations('en', {
      NEW_ORDER: 'New order',
      MY_ORDERS: 'My orders',
      MY_RESULTS: 'Images and sensors',
      MY_PROFILE: 'My profile',
      EXIT : 'Exit',
      ORDER : 'Order',
      NAME_ORDER : 'Order name',
      IMAGE_SETTINGS : 'Image settings',
      NO_TERITORIES: 'Number of selected teritorries:',
      SURFACE: 'Selected surface in ha:',
      IMAGE_TYPES: 'Image types:',
      IMAGE_START: 'Start of image taking:',
      IMAGE_END: 'End of image taking:',
      IMAGE_FREQ: 'Image frequency:',
      SENSOR_SETTINGS: 'Sensor settings',
      NO_SENSORS: 'Number of selected sensors',
	  SEVEN_DAYS: '7 days',
	  FIFTEEN_DAYS: '15 days',
	  MONTH: '30 days',
	  TWO_MONTHS: '60 days',
	  AGAIN: 'PONOVO',
	  SENSOR: 'Sensor',
    PASSWORD: 'PASSWORD',
    NAME: 'NAME',
    ADDRESS: 'ADDRESS',
    POST_CODE: 'POST CODE',
    CITY: 'CITY',
    PHONE: 'PHONE',
    DOB: 'DATE OF REGISTRATION',
    SAVE: 'SAVE',
    EMAIL: 'E-MAIL',
    MY_DATA: 'My profile',
    RECORDING: 'Recording',
    ORDERS: 'Orders',
    IMAGES: 'Images',
    IMAGE_NAME: 'Name',
    IMAGE_TYPE: 'Type',
    IMAGE_TIME: 'Date',
    OPEN: 'Open',
    SENSORS: 'Sensors',
    FROM: 'From',
    TO: 'To',
    SENSOR_ID: 'Sensor id',
    REGISTER: 'Create account',
    LOGIN: 'Log in',
    LOGIN_MAIL: 'E-mail',
    LOGIN_PASSWORD : 'Password',
    ESTIMATE : 'ESTIMATE',
    DETAILS : 'Details',
    PERSONAL_ACCOUNT: 'Personal account',
    COMPANY_ACCOUNT: 'Company/Community account',
    ACCOUNT_TYPE: 'ACCOUNT TYPE',
    SURNAME: 'SURNAME',
    MAIL_EXAMPLE: 'my@mail.com',
    PROFILE_CHANGE: 'Profile data change',
    PROFILE_CHANGE_SUCCESS: 'Profile information successfully updated.',
    PROFILE_CHANGE_FAIL: 'Profile information update failed! Please contact our support team.',
    CLOSE: 'Close',
    USERNAME: 'USERNAME',
    COUNTRY: 'COUNTRY',
    LOGIN_USERNAME: 'Username',
    REGISTER_SUCCESS : 'Registration process completed successfully. You will receive mail with activation link shortly.',
    REGISTER_ERROR : 'There was an error with registration procedure. Try again later or contant our support team.',
    REGISTER_TITLE : 'REGISTRATION',
    BACK_TO_LOGIN: 'Back to login',
    BACKEND_ERROR: 'Error in loading data. Try again later or contact our support team.',
    CREATE: 'REGISTER',
    NO_ORDERS: 'There are no orders on your profile. Set new order by clicking on ',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'NOT ACTIVE',
    LOADING: 'LOADING...',
    CREATED_AT: 'Created',
    DESCRIPTION: 'Description',
    ACTIVE_SENSORS: 'Activated',
    INACTIVE_SENSORS: 'Not activated',
    INFORMATION: 'Informations',
    CHOOSEN_SERVICES: 'Selected services:',
    CHOOSEN_NO_T: 'Number of selected territories ',
    CHOOSEN_NO_T_SURFACE: 'With a total surface of',
    CHOOSEN_NO_SENSORS: 'Placed sensors',
    CHOOSEN_EVALUATE: 'Evaluation',
    APPROX_VALUE: 'Approximate value of services is',
    ESTIMATE_ALERT: 'NOTE: Estimated value is calculated only approximately and may vary from the exact prices. After the order confirmation you will be contacted by our team who will familiarize you with the accurate price, method and schedule of payments.',
    LEGAL_NOTE: 'Legal note',
    ACCEPT_TOS: 'By ordering selected services, you accept Terms of Service.',    
    CONFIRM_ORDER: 'Confirm order',
    CANCEL_ORDER: 'Back',
    ORDER_SUCCESS: 'Order successfully placed. You will be contacted be our staff according to your profile data.',
    ORDER_FAILED: 'Error occured while placing and order. Please try again later or contact our support team.',
    EVALUATE_CLICK: 'Click here to estimate',
    SENSOR_DESCRIPTION: 'Sensor description',
    ERROR_GEN: 'ERROR',
    ERROR_GEN_DET: 'Error in communication occured. Please try again later or contact our support team.',
    WARN_NAME: 'Order name must contain at least 3 alpha-numerical characters.',
    WARN_IMG_TYPES: 'At least one image type must be selected.',
    WARNING_GEN : 'WARNING',
    WARNING_IMG_DESC: 'Order description cannot have more than 100 characters.',
    ERROR_LOGIN : 'Please check your username and try again',
    TIME_FILTER: 'Time filter'
    })
    .translations('rs', {
      NEW_ORDER: 'Nova porudžbina',
      MY_ORDERS: 'Moje porudžbine',
      MY_RESULTS: 'Snimanja i senzori',
      MY_PROFILE: 'Moji podaci',
      EXIT : 'Izlaz',
      ORDER : 'Narudžbina',
      NAME_ORDER : 'Ime narudžbine',
      IMAGE_SETTINGS : 'Podešavanje snimanja',
      NO_TERITORIES: 'Broj obeleženih teritorija:',
      SURFACE: 'Obeležena površina u ha:',
      IMAGE_TYPES: 'Tipovi snimanja:',
      IMAGE_START: 'Početak snimanja:',
      IMAGE_END: 'Kraj snimanja:',
      IMAGE_FREQ: 'Frekvencija snimanja:',
      SENSOR_SETTINGS: 'Podešavanja senzora',
      NO_SENSORS: 'Broj obeleženih senzora',
	  SEVEN_DAYS: '7 dana',
	  FIFTEEN_DAYS: '15 dana',
	  MONTH: '30 dana',
	  TWO_MONTHS: '60 dana',
	  AGAIN: 'PONOVO',
	  SENSOR: 'Senzor',
	  PASSWORD: 'LOZINKA',
	  NAME: 'IME',
	  ADDRESS: 'ADRESA',
	  POST_CODE: 'POŠTANSKI BROJ',
	  CITY: 'OPŠTINA',
	  PHONE: 'KONTAKT TELEFON',
	  DOB: 'DATUM REGISTRACIJE',
	  SAVE: 'SAČUVAJ',
    EMAIL: 'MEJL ADRESA',
	  MY_DATA: 'Moji podaci',
	  RECORDING: 'Snimanje',
	  ORDERS: 'Narudžbine',
	  IMAGES: 'Slike',
	  IMAGE_NAME: 'Ime',
	  IMAGE_TYPE: 'Tip slike',
	  IMAGE_TIME: 'Vreme',
	  OPEN: 'Otvori',
	  SENSORS: 'Senzori',
	  FROM: 'Od',
	  TO: 'Do',
	  SENSOR_ID: 'Senzor id',
    REGISTER: 'Napravi novi nalog',
    LOGIN: 'Ulaz',
    LOGIN_MAIL: 'Mejl adresa',
    LOGIN_PASSWORD : 'Lozinka',
    ESTIMATE : 'Proceni',
    DETAILS : 'Detalji',
    PERSONAL_ACCOUNT: 'Fizičko lice',
    COMPANY_ACCOUNT: 'Pravno lice (kompanija ili udruženje)',
    ACCOUNT_TYPE: 'TIP NALOGA',
    SURNAME: 'PREZIME',
    MAIL_EXAMPLE: 'moj@mejl.rs',
    PROFILE_CHANGE: 'Promena podataka',
    PROFILE_CHANGE_SUCCESS: 'Promena podataka je uspešno obavljena.',
    PROFILE_CHANGE_FAIL: 'Promena podataka nije uspela! Molimo kontaktirajte našu podršku.',
    CLOSE: 'Zatvori',
    USERNAME: 'KORISNIČKO IME',
    COUNTRY: 'DRŽAVA',
    LOGIN_USERNAME: 'Korisničko ime',
    REGISTER_SUCCESS : 'Registracija uspešno obavljena. Uskoro ćete na unetu mejl adresu dobiti mejl sa aktivacionim linkom. Ukoliko imate problema sa aktiviranjem naloga, kontaktirajte našu podršku.',
    REGISTER_ERROR : 'Došlo je do greške u procesu registracije. Pokušajte ponovo kasnije ili kontaktirajte našu podršku.',
    REGISTER_TITLE : 'REGISTRACIJA',
    BACK_TO_LOGIN: 'Nazad na prijavu',
    BACKEND_ERROR: 'Greška pri učitavanju podataka. Pokušajte kasnije ili kontaktirajte našu podršku.',
    CREATE: 'REGISTRACIJA',
    NO_ORDERS: 'Nemate nijednu porudžbinu na profilu. Postavite novu klikom na ',
    ACTIVE: 'AKTIVNA',
    INACTIVE: 'NIJE AKTIVNA',
    LOADING: 'UČITAVANJE...',
    CREATED_AT: 'Napravljena',
    DESCRIPTION: 'Opis narudžbine',
    ACTIVE_SENSORS: 'Aktiviranih',
    INACTIVE_SENSORS: 'Neaktiviranih',
    INFORMATION: 'Informacija',
    CHOOSEN_SERVICES: 'Odabrane usluge:',
    CHOOSEN_NO_T: 'Broj obeleženih teritorija',
    CHOOSEN_NO_T_SURFACE: 'Ukupne površine',
    CHOOSEN_NO_SENSORS: 'Broj senzora',
    CHOOSEN_EVALUATE: 'Procena vrednosti:',
    APPROX_VALUE: 'Približna vrednost obeleženih usluga je',
    ESTIMATE_ALERT: 'NAPOMENA: Procenjena vrednost je samo približno izračunata i može varirati od tačne cene. Po potvrdi narudžbine bićete kontaktirani od strane našeg tima koji će vas upoznati sa tačnom cenom, načinom i dinamikom plaćanja.',
    LEGAL_NOTE: 'Pravne informacije',
    ACCEPT_TOS: 'Naručivanjem obeleženih usluga prihvatam uslove korišćenja.',
    CONFIRM_ORDER: 'Potvrdi narudžbinu',
    CANCEL_ORDER: 'Nazad',
    ORDER_SUCCESS: 'Narudžbina je uspešno poslata. Očekujte da budete kontaktirani preko kontakt brojeva koji se nalaze u vašem profilu.',
    ORDER_FAILED: 'Došlo je do greške prilikom slanja narudžbine. Pokušajte kasnije ili kontaktirajte našu podršku.',
    EVALUATE_CLICK: 'Proceni narudžbinu',
    SENSOR_DESCRIPTION: 'Opis senzora',
    ERROR_GEN: 'GREŠKA',
    ERROR_GEN_DET: 'Došlo je do greške u komunikaciji. Pokušajte kasnije ili kontaktirajte našu podršku.',
    WARN_NAME: 'Ime narudžbine mora sadržati minimalno 3 karaktera.',
    WARN_IMG_TYPES: 'Minimalno jedan tip snimanja mora biti odabran.',
    WARNING_GEN : 'UPOZORENJE',
    WARNING_IMG_DESC: 'Opis narudžbine može imati maksimalno 100 karaktera.',
    ERROR_LOGIN : 'Proverite podatke i pokušajte ponovo',
    TIME_FILTER: 'Vremenski filter'
    });
    $translateProvider.preferredLanguage('en');
});

paisOperator.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
    	console.log("filter called " + url);
        return $sce.trustAsResourceUrl(url);
    };
}]);

paisOperator.directive("mySrc", function() {
    return {
      link: function(scope, element, attrs) {
        var img, loadImage;
        img = null;

        loadImage = function() {

          element[0].src = "/img/spinner.gif";

          img = new Image();
          img.src = attrs.mySrc;

          img.onload = function() {
            element[0].src = attrs.mySrc;
          };
        };

        scope.$watch((function() {
          return attrs.mySrc;
        }), function(newVal, oldVal) {
          if (oldVal !== newVal) {
            loadImage();
          }
        });
      }
    };
  });