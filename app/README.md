# yelims
:notebook::smiley:

## Development

How to get started.

```
sudo npm install -g create-react-native-app
```

Installing all dependencies

```
npm install
```

Run it and connect with [Expo]( https://expo.io/ )
Install the android [app]( https://play.google.com/store/apps/details?id=host.exp.exponent )

```
sudo sysctl -w fs.inotify.max_user_instances=2048
sudo sysctl -w fs.inotify.max_user_watches=524288

npm start
```

Scan the barcode and the app should open on your phone.

## Building an apk

To build an apk simply run the following commands:

```sh
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
react-native run-android
```## Building an apk

To build an apk simply run the following commands:

```sh
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
react-native run-android
```## Building an apk

To build an apk simply run the following commands:

```sh
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
react-native run-android
```


## Windows
To start the app on windows, you need to make sure react native uses the correct IP.

Find the correct network interface with `ipconfig`. (It's the one with a default gateway).

Copy the IPv4 address and run `$env:REACT_NATIVE_PACKAGER_HOSTNAME = 'x.x.x.x'` (replace x.x.x.x with your IP).

Now you can start the project with `npm start` or `npm run android`.

## Resources
List of icons: https://oblador.github.io/react-native-vector-icons/
