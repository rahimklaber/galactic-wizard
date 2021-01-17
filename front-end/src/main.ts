import App from './App.svelte';
import {router} from "./navigo"
import {store} from "./store"
import CreateToken from "./CreateToken.svelte"
import Tokens from "./tokens.svelte"
import ClaimTokens from "./ClaimTokens.svelte"
import BuyTokens from "./BuyTokens.svelte"
import Home from "./Home.svelte"
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
		},"/claim": function(){
			store.set(ClaimTokens)
		},"/buy": function(){
			store.set(BuyTokens)
		},"/": function(){
			store.set(Home)
		}

	}
).resolve()
export default app;