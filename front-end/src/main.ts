import App from './App.svelte';
import {router} from "./navigo"
import {store} from "./store"
import CreateToken from "./CreateToken.svelte"
import Tokens from "./tokens.svelte"
const app = new App({
	target: document.body,
});
router.on(
	{
		"/create": function(){
			store.set(CreateToken)
		},
		"/tokens": function(){
			store.set(Tokens)
		}

	}
).resolve()
export default app;