import { getUserSession } from '../helpers/storage.js';

const Header = () => {
  const user = getUserSession();
  const showNavigation =
    !window.location.pathname.includes('/pages/login') &&
    !window.location.pathname.includes('/pages/signup');

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
              <i id="no-notifications" class="icon-notification-no"  onclick="const menu = document.querySelector('#notifications-popup'); if (menu.classList.contains('hidden')) { menu.classList.remove('hidden'); return; }; menu.classList.add('hidden');"></i>
              <i id="with-notifications" class="icon-notification-yes hidden"  onclick="const menu = document.querySelector('#notifications-popup'); if (menu.classList.contains('hidden')) { menu.classList.remove('hidden'); return; }; menu.classList.add('hidden');"></i>
            </div>
            ${`
              <img
                id="avatar"
                class="pointer" 
                src="${user.photo}" alt="User logo"
                onclick="const menu = document.querySelector('#header-menu'); if (menu.classList.contains('hidden')) { menu.classList.remove('hidden'); return; }; menu.classList.add('hidden');" />`}
          `
            : `<a href="/pages/login"><button class="btn btn-secondary">Sign in</button></a>`
        } 
      </nav>`
          : ``
      }
    </div>

   <nav id="header-menu" class="hidden">
      <div class="header-menu__container">
        <ul>
            <li class="text-body-2">
              <a href="/pages/settings#myProfile"><i class="icon-profile"></i> <span>Profile</span></a>
            </li>
            <li class="text-body-2">
              <a href="/pages/my-reports"><i class="icon-reports"></i> <span>My Reports</span></a>
            </li>
            <li class="text-body-2">
              <a href="/pages/settings#settings"><i class="icon-settings"></i> <span>Settings</span></a>
            </li>
            <li class="text-body-2">
              <a href="/pages/logout"><i class="icon-logout"></i> <span>Logout</span></a>
            </li>
        </ul>
      </div>
    </nav>

    <div id="notifications-popup" class="hidden">
      <div class="notifications-popup__container">
        <div class="notifications-popup__header text-body-1">
          Notifications <span id="notification-count"></span>
        </div>
        <ul>
          
        </ul>
        <div id="markAllAsReadAction" class="notifications-popup__footer text-body-4 medium pointer">
          <i class="icon-mark-as-read"></i> Mark all as read
        </div>
      </div>
    </div>
  </header>
  `;
};

export default Header;
