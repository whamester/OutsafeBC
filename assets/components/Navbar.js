import { getUserSession } from '../helpers/storage.js'

const Navbar = () => {
	const user = getUserSession()
	const showNavigation =
		!window.location.pathname.includes('/pages/login') &&
		!window.location.pathname.includes('/pages/signup')

	return `
  <header>
  <div id="header-content">
    <a href="/pages/home"><img src="../../assets/img/header-logo-dark.svg" style="width:8.06rem; height:100%" alt="Outsafe BC logo" /></a>
    ${
			!!showNavigation
				? ` <nav id="header-nav">
   
      ${
				user
					? `
          <div class="notification-container pointer">
            <i class="icon-notification-no"></i>
            <i class="icon-notification-yes hidden"></i>
          </div>
          <a href="/pages/settings"><img id="avatar" src="${user.photo}" alt="User logo" /></a>`
					: `<a href="/pages/login"><button class="btn btn-secondary">Sign in</button></a>`
			} 
    </nav>`
				: ``
		}
   </div>
  </header>
  `
}
// TODO: Temporarily sending the user to the profile by clicking the avatar icon, this will
// be replaced by the context menu
export default Navbar
