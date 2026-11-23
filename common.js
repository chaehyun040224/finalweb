// ===== 펫블리 공통 기능 (모든 페이지에서 사용) =====
// 회원 정보, 로그인 상태, 장바구니는 브라우저(localStorage)에 저장돼요.

const Store = {
  get(key, empty) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v === null ? empty : v; }
    catch (e) { return empty; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

// 지금 로그인한 회원 (없으면 null)
function currentUser() {
  const id = Store.get('petbly_login', null);
  if (!id) return null;
  return Store.get('petbly_users', []).find(u => u.id === id) || null;
}

// 장바구니에 담긴 상품 개수
function cartCount() {
  return Store.get('petbly_cart', []).reduce((sum, item) => sum + item.qty, 0);
}

// 장바구니에 담기
function addToCart(item) {
  const cart = Store.get('petbly_cart', []);
  const found = cart.find(c => c.id === item.id);
  if (found) found.qty += 1;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, checked: true });
  Store.set('petbly_cart', cart);
  renderUtil();
  showToast('장바구니에 담았어요', 'cart.html', '장바구니 보기');
}

// 로그아웃
function logout() {
  localStorage.removeItem('petbly_login');
  location.href = 'index.html';
}

// 숫자를 12,000원 형식으로
function won(n) { return n.toLocaleString('ko-KR') + '원'; }

// 상단 오른쪽 메뉴 (로그인 상태에 따라 바뀜)
function renderUtil() {
  const menu = document.querySelector('.util-menu');
  if (!menu) return;
  const user = currentUser();

  menu.innerHTML =
    (user
      ? '<li><span class="hello"><b></b>님</span></li><li><a href="#" id="logoutBtn">로그아웃</a></li>'
      : '<li><a href="login.html">로그인</a></li><li><a href="join.html">회원가입</a></li>') +
    '<li><a href="guestbook.html">방명록</a></li>' +
    '<li><a href="cart.html">장바구니 <span class="cart-num">' + cartCount() + '</span></a></li>' +
    '<li><a href="mypage.html">마이페이지</a></li>';

  if (user) {
    menu.querySelector('.hello b').textContent = user.name;
    menu.querySelector('#logoutBtn').addEventListener('click', e => {
      e.preventDefault();
      if (confirm('로그아웃 할까요?')) logout();
    });
  }
}

// 화면 아래에 잠깐 뜨는 알림
function showToast(text, link, linkText) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = '<span></span>' + (link ? '<a href="' + link + '">' + linkText + ' →</a>' : '');
  toast.querySelector('span').textContent = text;
  toast.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

document.addEventListener('DOMContentLoaded', renderUtil);
