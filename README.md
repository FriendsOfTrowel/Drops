![Friends of Trowel](https://raw.githubusercontent.com/Trowel/Trowel/master/media/dist/banners/friendsoftrowel-black-on-transparent.png)

# Trowel Drops
[![npm version](https://badge.fury.io/js/trowel-Drops.svg)](https://badge.fury.io/js/trowel)
[![Bower version](https://badge.fury.io/bo/trowel-Drops.svg)](https://badge.fury.io/bo/trowel-Drops)

The official Trowel Component for drops
Drops is a *Trowel Component*, please refer to the [Trowel doc](https://github.com/Trowel/Trowel/blob/master/doc/1-the-concept.md) for more informations about how works *Trowel Components*

## Getting Started
### Download
You can easily install *Trowel Drops* by using npm, Yarn or Bower

```bash
# With bower
$ bower install trowel-drops

# With npm
$ npm install trowel-drops

# With yarn
$ yarn add trowel-drops
```

You can also download a zip archive [right here](https://github.com/FriendsOfTrowel/Drops/archive/master.zip).

### Installation
#### *Scss*
The main scss file to include to your main `.scss` file is located at the `./src/scss/drops.scss`. As a *Trowel Component*, it also requires two dependencies to compile the *scss* code. Here an *scss* installation snippet.

```
// Trowel Dependencies
@import './path/to/dependencies/trowel-core/src/trowel';

// Trowel Components Drops
@import './path/to/dependencies/trowel-drops/src/scss/drops.scss';
```

#### *CSS*
If you don't want to customize the trowel component in `scss` you can use the css file available at `./dest/css/drops.css`. A minified version is available at the same location.

#### *JavaScript*
Trowel Drops requires [Tether](https://github.com/HubSpot/tether). Make sure the library is included before trowel-drops script.

You have several javascript files for different use cases :
* The browser ready file is available at `./dest/javascript/drops.js` (a minified version exists at `dest/javascript/drops.min.js`)
* The script written in es2015 and ready to `import` is available at `./src/javascript/drops.js`




## Usage
to be written

## Contributing
If you want to contribute you can checkout the contribution guide [over here](CONTRIBUTING.md)

## License
MIT © [Trowel](trowel.github.io)
