
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
import {Content, Header,HeaderNav, SideNav,SideNavItems,SideNavLink,HeaderNavItem} from "carbon-components-svelte"
let isSideNavOpen = false
import {store} from "./store"
import createToken from "./CreateToken.svelte"
import { onMount } from "svelte";
import {router} from "./navigo"
let page = createToken

store.subscribe( value => {
		page = value
	}
)
onMount(async()=>router.updatePageLinks())
</script>

<Header platformName="Galactic Wizard"
persistentHamburgerMenu={true}
bind:isSideNavOpen>

<HeaderNav>
    <HeaderNavItem href="/create" data-navigo text="Create Token" />
    <HeaderNavItem href="/tokens" data-navigo text="View Tokens" />
  </HeaderNav>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink href="/create" data-navigo text="Create Token" />
		<SideNavLink href="/tokens" data-navigo text="View Tokens" />
	  </SideNavItems>
</SideNav>

<Content class="content">
	<svelte:component this={page}/>
</Content>