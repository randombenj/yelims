# yelims
:notebook::smiley:

## Windows
To start the app on windows, you need to make sure react native uses the correct IP.

Find the correct network interface with `ipconfig`. (It's the one with a default gateway).

Copy the IPv4 address and run `$env:REACT_NATIVE_PACKAGER_HOSTNAME = 'x.x.x.x'` (replace x.x.x.x with your IP).

Now you can start the project with `npm start` or `npm run android`.