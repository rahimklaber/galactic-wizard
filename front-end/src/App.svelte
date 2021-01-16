
<style lang="scss" global>
	@import "carbon-components-svelte/css/g10";

	.content{
		display: flex;
		justify-content: center;
	}


	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<script lang="ts">
import {Content, Header, SideNav} from "carbon-components-svelte"
let isSideNavOpen = false
import {store} from "./store"
import createToken from "./CreateToken.svelte"
let page = createToken

store.subscribe( value => {
		page = value
	}
)

</script>

<Header platformName="Galactic Wizard"
persistentHamburgerMenu={true}
bind:isSideNavOpen>

<SideNav bind:isOpen={isSideNavOpen}>

</SideNav>

</Header>

<Content class="content">
	<svelte:component this={page}/>
</Content>