

function open_navigation(e) {
  let navigation = document.getElementById('main_navigation');
  navigation.classList.add('is-active', 'show');

  return navigation;
}

function close_navigation(e) {
  let navigation = document.getElementById('main_navigation');
  navigation.classList.remove('is-active', 'show');

  return navigation;
}
