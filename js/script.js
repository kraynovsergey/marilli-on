var lazyLoadInstance = new LazyLoad({});

document.addEventListener('DOMContentLoaded', function() {
  let scrollY;

  //page-height
  function syncHeight() {
    document.documentElement.style.setProperty(
      '--window-inner-height',
      `${window.innerHeight}px`
    );
  }

  syncHeight();
  window.addEventListener('resize', syncHeight);

  //scrollToTop
  document.querySelector(".header__logo").addEventListener('click', function() {
    window.scrollTo(0,0)
  });

  //menu height
  function syncMenuHeight() {
    const menuItemContent = document.querySelectorAll('.menu__list--lvl1 .menu__item-content');
    for (content of menuItemContent) {
      content.closest('.menu__list--lvl1').style.setProperty('--sync-height', `${content.scrollHeight}px`);
    }
  }
  syncMenuHeight();
  window.addEventListener('resize', syncMenuHeight);
  document.addEventListener('DOMSubtreeModified', syncMenuHeight);

  //menu
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('.menu');

  menuButton.addEventListener('click', () => {
      let expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      expanded ? menuButton.setAttribute('aria-label', 'Открыть меню') : menuButton.setAttribute('aria-label', 'Закрыть меню');
      menuButton.classList.toggle('menu-button--open');
      menu.classList.toggle('menu--open');

      //dis scroll
      scrollY = window.scrollY;
      document.documentElement.classList.toggle('is-locked');

      if(!document.documentElement.classList.contains('is-locked')) {
        window.scrollTo(0, scrollY);
      }

      //submenu
      let headerMenuControls = menu.querySelectorAll('.menu__mobile-control');
      for (button of headerMenuControls) {
        button.addEventListener('click', function() {
          let headerMenuDropdown = this.closest('.menu__item--dropdown');
          headerMenuDropdown.classList.add('menu__item--open');
        });
      }

      let headerItemClose = menu.querySelectorAll('.menu__item-close');
      for (button of headerItemClose) {
        button.addEventListener('click', function() {
          let headerMenuDropdownOpen = this.closest('.menu__item--dropdown.menu__item--open');
          headerMenuDropdownOpen.classList.remove('menu__item--open');
        });
      } 
  });

  //header height
  const headerHeightSync = () => {
    let headerHeight = document?.querySelector('.header');
    document.querySelector(':root').style.setProperty('--header-height', `${headerHeight.offsetHeight}px`);
  }
  headerHeightSync()
  window.addEventListener('resize', function() {
    headerHeightSync()
  });


  //lang dropdown
  const languageDropdowns = document?.querySelectorAll('.language-dropdown__control');
  languageDropdowns.forEach(el => {

    el.addEventListener('click', function (e) {
      el.closest('.language-dropdown').classList.toggle('language-dropdown--open');
    })
    document.addEventListener('click', function (e) {
      const isClickedOutside = !el.closest('.language-dropdown').contains(e.target);
      if (isClickedOutside) {
        el.closest('.language-dropdown').classList.remove('language-dropdown--open');
      }
    });
  });

  //modals
  const Modal = new HystModal({
    linkAttributeName: "data-hystmodal",
    backscroll:false,
  });

  //visit modal
  const modalNotice = new HystModal({
    linkAttributeName: 'data-hystmodal',
    afterClose: function (modal) {
      localStorage.setItem('visited', true);
    },
  });

  if (localStorage) {
    if (!localStorage.getItem('visited')) {
      modalNotice.open('#modal-notice');
    } else {
      modalNotice.close('#modal-notice');
    }
  } else {
    modalNotice.open('#modal-notice');
  }

  //tabs
  let tabs = document?.querySelectorAll('.tabbed');
  tabs.forEach(el => {
      const tablist = el.querySelector('ul');
      const tabs = tablist.querySelectorAll('a:not(.tag)');
      const panels = el.querySelectorAll('[id^="section"]');

      const switchTab = (oldTab, newTab) => {
        newTab.focus();
        newTab.removeAttribute('tabindex');
        newTab.setAttribute('aria-selected', 'true');
        oldTab.removeAttribute('aria-selected');
        oldTab.setAttribute('tabindex', '-1');
        let index = Array.prototype.indexOf.call(tabs, newTab);
        let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
        panels[oldIndex].hidden = true;
        panels[index].hidden = false;
      }

      tablist.setAttribute('role', 'tablist');

      Array.prototype.forEach.call(tabs, (tab, i) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('id', 'tab' + (i + 1));
        tab.setAttribute('tabindex', '-1');
        tab.parentNode.setAttribute('role', 'presentation');

        const pointerEvent = function (pointer) {
          tab.addEventListener(pointer, e => {
            e.preventDefault();
            let currentTab = tablist.querySelector('[aria-selected]');
            if (e.currentTarget !== currentTab) {
              switchTab(currentTab, e.currentTarget);
            }
          });
        }

        if(el.classList.contains('tabbed--click')) {
          pointerEvent('click');
        } else {
          pointerEvent('mouseover');
        }

        tab.addEventListener('keydown', e => {
          let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
          let dir = e.which === 38 ? index - 1 : e.which === 40 ? index + 1 : e.which === 39 ? 'down' : null;
          if (dir !== null) {
            e.preventDefault();
            dir === 'down' ? panels[i].focus() : tabs[dir] ? switchTab(e.currentTarget, tabs[dir]) : void 0;
          }
        });
      });

      Array.prototype.forEach.call(panels, (panel, i) => {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('tabindex', '-1');
        let id = panel.getAttribute('id');
        panel.setAttribute('aria-labelledby', tabs[i].id);
        panel.hidden = true;
      });

      tabs[0].removeAttribute('tabindex');
      tabs[0].setAttribute('aria-selected', 'true');
      panels[0].hidden = false;
  });

  //cookie
  let cookieClose = document.querySelectorAll('[data-cookie-close]');

  cookieClose.forEach(close => {
    close.addEventListener('click', function() {
      this.closest('.cookie').hidden = true;
    });
  });

  //map
  if (document.querySelector('#c-map')) {
    ymaps.ready(init);

    function init() {
      const map = document?.querySelector('.c-map');
      const mapCenterLat = map?.dataset.centerLat;
      const mapCenterLong = map?.dataset.centerLong;
      const mapCoords = map?.dataset.coords;
      let data = JSON.parse(mapCoords);
      const mapZoom = map?.dataset.zoom;
      const iconImageHref = map?.dataset.iconHref;
      const iconImageWidth = map?.dataset.iconWidth;
      const iconImageHeight = map?.dataset.iconHeight;
      const mapControls = document?.querySelectorAll(".map-control");
      const mapLinks = document?.querySelectorAll(".map-link");

      var contactsMap = new ymaps.Map('c-map', {
        center: [mapCenterLat, mapCenterLong],
        zoom: mapZoom,
        controls: ['smallMapDefaultSet']
        }, {
          searchControlProvider: 'yandex#search'
        }),
        
        objectManager = new ymaps.ObjectManager({
          clusterize: true,
          gridSize: 32,
          clusterDisableClickZoom: false
        });
        
      contactsMap.controls.remove('geolocationControl');
      contactsMap.controls.remove('searchControl');
      contactsMap.controls.remove('trafficControl');
      contactsMap.controls.remove('typeSelector');
      contactsMap.controls.remove('fullscreenControl');
      contactsMap.controls.remove('rulerControl');
      contactsMap.behaviors.disable(['scrollZoom']);

      objectManager.clusters.options.set('clusterIconColor', '#009D72');
      objectManager.clusters.options.set('hasBalloon', false);
      contactsMap.geoObjects.add(objectManager);

      objectManager.objects.options.set({
        iconLayout: 'default#imageWithContent',
        iconImageHref: `${iconImageHref}`,
        iconImageSize: [iconImageWidth, iconImageHeight],
        hideIconOnBalloonOpen: false,
      });

      objectManager.add(data);

      mapControls.forEach(function(item, i) {
        item.addEventListener('click', function() {
          let destination = data.features[i].geometry.coordinates;
          contactsMap.setZoom(16);
          contactsMap.panTo(destination, {
            flying: true,
            duration: 2000,
          });
        });
      });

      mapLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          contactsMap.setZoom(18);
        });
      });
    }
  }
});
