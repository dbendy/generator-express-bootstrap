'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var async = require('async');
var validateModuleName = require('validate-npm-package-name');
var _ = require('lodash');
var fs = require('fs');

var handleError = function(err) {
	console.log("Something went wrong:", err.stack);
	process.exit();
};

module.exports = yeoman.generators.Base.extend({

	initializing: {
		welcome: function () {
			// Have Yeoman greet the user.
			this.log(yosay('Welcome to the Express-Bootsstrap 2.0 app generator!'));
		}
	},

	prompting: {
		mainPrompt: function () {
			var done = this.async();
			var prompts = [

				{
					name: 'appName',
					type: 'input',
					default: process.cwd().split('/').pop().toLowerCase(),
					message: 'App name (only lower case)?',
					filter: function(input) {
						return input.toString();
					},
					validate: function(input) {
						// this function validates the app name against the npm rules for module names
						return validateModuleName(input).validForNewPackages;
					}
				},

				{
					name: 'description',
					type: 'input',
					default: '',
					message: 'Description?',
					filter: function(input) {
						return input.toString();
					}
				},

				{
					name: 'author',
					type: 'input',
					default: '',
					message: 'Author?',
					filter: function(input) {
						return input.toString();
					}
				}
			];

			this.prompt(prompts, function (props) {
				this.appName = props.appName;
				this.description = props.description;
				this.author = props.author;
				done();
			}.bind(this));
		}
	},

	configuring: {
		createPackage: function () {

			this.log("Creating package configs...");

			this.pkg = this.fs.readJSON(this.sourceRoot() + '/../_package.json');

			var userInput = {
				"name": this.appName,
				"description": this.description,
				"author": this.author
			};
			this.pkg = _.extend(this.pkg, userInput);
		}
	},

	writing: {

		writePackage: function () {

			var done = this.async();
			this.log("Writing package.json...");
			var destination = this.destinationRoot() + '/package.json';
			fs.writeFile(destination, JSON.stringify(this.pkg, null, 2), function(err) {
				if (err) handleError(err);
				done();
			});
		},

		copyingFiles: function () {
			this.log("Copying files...");
			this.fs.copy(this.sourceRoot(), this.destinationRoot());
			var self = this;

			[
				'.editorconfig',
				'.gitignore',
				'.eslintrc'
			].forEach(function(file) {
				self.fs.copy(self.sourceRoot() + '/' + file, self.destinationRoot() + '/' + file);
			});

		}

	},

	install: {
		runNpmInstall: function() {
			this.log("Running first npm install...");
			this.npmInstall();
		}
	},

	end: {

		addAppNameToConfig: function () {
			this.log("Adding app name to config...");
			var pathToConfig = this.destinationRoot() + '/config/default.js';
			var appConfig = require(pathToConfig);
			fs.unlinkSync(pathToConfig);
			appConfig.APP_NAME = this.appName;
			var configString = 'module.exports = \n' + JSON.stringify(appConfig, null, 2) + ';\n';
			this.fs.write(pathToConfig, configString);
		},

		startApp: function() {
			this.log("Starting app...");
			this.log("Open up your browser and go to 127.0.0.1:3000");
			this.spawnCommand('npm', ['start']);
		}
	}
});
