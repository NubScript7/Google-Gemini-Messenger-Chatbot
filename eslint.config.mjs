import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
  	files: ["**/*.js"],
  	languageOptions: {
  		sourceType: "commonjs"
  	}
  },
  {
  	languageOptions: {
  		globals: globals.node 
  	}
  },
  pluginJs.configs.recommended,
  {
  	rules: {
  		semi: ["warn", "always"],
  	  quotes: ["warn", "double"],
  	  "no-unused-vars": "warn",
  	  "no-unused-private-class-members": "warn",
  	  "no-async-promise-executor": "warn"
  	}
  }
];