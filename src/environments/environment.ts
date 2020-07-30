// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // base_url: 'http://18.222.30.11:5558/drop/v1/',
  api: 'http://localhost:8080/live',
  wocket_url: 'http://localhost:5558/drop/v1/live',
  base_url: 'http://52.14.79.133:5558/drop/v1/',
  grant_type: 'password',
  grant_type_client: 'client_credentials',
  public_key: 'QrspHGvroh77MnITdPdHHzzqSgnhI4re',
  private_key: 'xCpE9nc9Tbek6xkT',
  google_map_api_key: 'AIzaSyC_2bjO2wL-sv-Gaq94-j63rHm2Jo8SJB8',
  firebase: {
    apiKey: "AIzaSyC_2bjO2wL-sv-Gaq94-j63rHm2Jo8SJB8",
    authDomain: "drop-279311.firebaseapp.com",
    databaseURL: "https://drop-279311.firebaseio.com",
    projectId: "drop-279311",
    storageBucket: "drop-279311.appspot.com",
    messagingSenderId: "55598287669",
    appId: "1:55598287669:web:7c73761c0ac262e0bb9a7c",
    measurementId: "G-3BPGG784VC"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
