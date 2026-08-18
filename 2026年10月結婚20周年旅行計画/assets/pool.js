(function(){
  const D = window.POOLS;
  const mapEl = document.getElementById('map');
  if(!D){ mapEl.innerHTML = '<p style="padding:24px">データ（data/pools.js）を読み込めませんでした。</p>'; return; }

  const P = D.pools;
  const yearRound = p => /通年/.test(p.season);
  // 「この夏まだ間に合う」= 通年営業、または営業期間に9月が含まれるもの（調査時点 8/18）
  const openNow = p => yearRound(p) || /8月31日|9月/.test(p.season);
  const badge = p =>
    (p.stay ? '<span class="badge badge--stay">泊まれる</span>' : '') +
    (yearRound(p) ? '<span class="badge badge--year">通年</span>'
                  : '<span class="badge badge--season">季節限定</span>') +
    (openNow(p) ? '<span class="badge badge--now">今夏OK</span>' : '');

  /* ================= 一覧表 ================= */
  const tbody = document.getElementById('tbody');
  P.forEach(p => {
    const tr = document.createElement('tr');
    tr.dataset.no = p.no;
    tr.innerHTML =
      '<td><div class="name-cell"><span class="rank">'+p.no+'</span><b>'+p.name+'</b></div></td>'+
      '<td style="white-space:nowrap">'+p.area+'</td>'+
      '<td class="num"><b>'+p.drive.min+'分</b></td>'+
      '<td class="num">'+p.drive.km.toFixed(1)+'km</td>'+
      '<td style="min-width:16em">'+p.pool+'</td>'+
      '<td style="min-width:12em">'+p.season+'</td>'+
      '<td style="white-space:nowrap">'+(p.stay?'○':'—')+'</td>'+
      '<td style="min-width:14em;font-size:12.5px;color:var(--ink-soft)">'+p.price+'</td>';
    tr.addEventListener('click', () => select(p.no, true));
    tbody.appendChild(tr);
  });

  /* ================= カード ================= */
  const cards = document.getElementById('cards');
  P.forEach(p => {
    const el = document.createElement('article');
    el.className = 'card';
    el.id = 'pool-' + p.no;
    el.dataset.no = p.no;
    const ig = '<div class="ig-row">' +
      (p.ig ? '<a class="ig-btn is-official" href="'+p.ig+'" target="_blank" rel="noopener">公式Instagram '+p.igName.split('（')[0]+'</a>' : '') +
      '<a class="ig-btn" href="'+p.tagUrl+'" target="_blank" rel="noopener">Instagram 人気の投稿を見る</a>' +
      '</div>';
    el.innerHTML =
      '<h3><span class="rank">'+p.no+'</span><span>'+p.name+'</span></h3>'+
      '<p class="addr">'+p.addr+'</p>'+
      '<p class="drive">'+p.drive.min+'<small>分（'+p.drive.km.toFixed(1)+'km・新座市から）</small></p>'+
      '<p style="margin:8px 0 0">'+badge(p)+'</p>'+
      '<dl style="margin-top:14px">'+
        '<dt>プール</dt><dd>'+p.pool+'</dd>'+
        '<dt>営業期間</dt><dd>'+p.season+'</dd>'+
        '<dt>料金</dt><dd>'+p.price+'</dd>'+
        '<dt>公式</dt><dd><a href="'+p.site+'" target="_blank" rel="noopener">サイトを開く</a></dd>'+
      '</dl>'+
      '<p class="feat">'+p.detail+'</p>'+ ig;
    el.addEventListener('click', e => { if(e.target.closest('a')) return; select(p.no, false); });
    cards.appendChild(el);
  });

  /* ================= 除外した施設 ================= */
  const ex = document.getElementById('excluded');
  ex.innerHTML = '<h3>候補に挙げたが載せなかったもの</h3><ul>' +
    D.excluded.map(e => '<li><b>'+e.name+'</b><br>'+e.reason+'</li>').join('') + '</ul>';

  /* ================= 那須の宿との組み合わせ ================= */
  const nl = D.nasuLink;
  if (nl) {
    const sec = document.getElementById('crosslink');
    const rows = nl.stays.map(s =>
      '<tr><td>'+s.no+'. '+s.name+'</td>'+
      '<td class="num">'+s.epinard.min+'分</td>'+
      '<td class="num">'+s.sunvalley.min+'分</td></tr>').join('');
    sec.innerHTML =
      '<h3>那須の宿に泊まって、屋内プールは日帰りで使う</h3>'+
      '<p>'+nl.note+'</p>'+
      nl.dayUse.map(d =>
        '<p style="margin:10px 0 0"><b>'+d.name+'</b>：'+d.pool+'<br>'+
        '<span style="font-size:13px;color:var(--ink-soft)">'+d.price+'</span><br>'+
        '<a href="'+d.site+'" target="_blank" rel="noopener">日帰り利用の案内</a></p>').join('')+
      '<div class="table-scroll" style="border:0;box-shadow:none;background:transparent">'+
      '<table><thead><tr><th>那須の宿候補</th><th class="num">エピナール那須まで</th>'+
      '<th class="num">サンバレー那須まで</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '<p style="margin:12px 0 0"><a href="index.html">→ 那須ハイランド周辺おすすめ宿マップで7軒の位置を見る</a></p>';
  }

  /* ================= 出典 ================= */
  const srcs = [
    ['スパリゾートハワイアンズ 公式サイト','https://www.hawaiians.co.jp/'],
    ['ハワイアンズ公式SNS一覧','https://www.hawaiians.co.jp/sns/index.html'],
    ['龍宮城スパ・ホテル三日月 プール','https://www.mikazuki.co.jp/ryugujo/yutoasobi/pool/'],
    ['三日月シーパークホテル勝浦 公式サイト','https://hmihotelgroup.com/mikazukikatsuura/'],
    ['ホテルエピナール那須 屋内温水プール','https://www.epinard.jp/spa/pool/'],
    ['ホテルエピナール那須 日帰り温泉パック','https://www.epinard.jp/spa/day_trip/'],
    ['星野リゾート リゾナーレ八ヶ岳','https://risonare.com/yatsugatake/'],
    ['ホテルサンバレー那須 湯遊天国／アクアヴィーナス','https://www.nasu3800.co.jp/spa/onsen.php'],
    ['東京サマーランド プール特集','https://www.summerland.co.jp/pool/'],
    ['東京サマーランド パークガイド','https://www.summerland.co.jp/guide/'],
    ['よみうりランド プールWAI','https://www.yomiuriland.com/wai/'],
    ['東武動物公園 プール','https://www.tobuzoo.com/pool/'],
    ['東武動物公園 プール料金','https://www.tobuzoo.com/ticket/pool/'],
    ['東武スーパープール リニューアル（トラベルWatch）','https://travel.watch.impress.co.jp/docs/news/2119325.html'],
    ['川越水上公園プール 2026年営業（小江戸川越Web）','https://mag.c-kawagoe.com/archives/14182'],
    ['しらこばと水上公園プール 料金・2026','https://papatto-odekake.com/shirakobato-pool-ryokin/'],
    ['よみうりランド プールWAI 2026（夏休みおでかけガイド）','https://summer.walkerplus.com/odekake/topics/article/1401396/'],
    ['リゾナーレ八ヶ岳 イルマーレ（いこーよ）','https://iko-yo.net/facilities/9339/attractions/6857'],
    ['OpenStreetMap / Nominatim（座標）','https://www.openstreetmap.org/copyright'],
    ['OSRM（経路・所要時間の算出）','https://project-osrm.org/'],
    ['国土地理院 住所検索API','https://maps.gsi.go.jp/development/ichiran.html'],
  ];
  document.getElementById('sources').innerHTML = srcs.map(([n,u]) =>
    '<li>'+n+' — <a href="'+u+'" target="_blank" rel="noopener">'+u+'</a></li>').join('');

  /* ================= 地図 ================= */
  if (typeof L === 'undefined'){
    mapEl.innerHTML = '<p style="padding:24px;color:var(--ink-soft)">地図ライブラリ'+
      '（vendor/leaflet/leaflet.js）を読み込めませんでした。下の比較表とカードはそのままご覧いただけます。</p>';
    return;
  }
  const map = L.map('map', {scrollWheelZoom:false}).setView([36.2,139.6], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:18, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const layPins = L.layerGroup().addTo(map);
  const layRoute = L.layerGroup().addTo(map);

  L.marker([D.origin.lat, D.origin.lng], {
    icon: L.divIcon({className:'', html:'<div class="pin-origin"></div>', iconSize:[22,22], iconAnchor:[11,11]}),
    zIndexOffset: 1000
  }).addTo(layPins)
    .bindPopup('<b>起点：'+D.origin.name+'</b><br><span class="pop-meta">'+D.origin.addr+'</span>')
    .bindTooltip('起点：新座市（ここから計測）', {permanent:true, direction:'bottom', offset:[0,12], className:'tip-pool tip-origin'});

  const markers = {}, routes = {};
  P.forEach(p => {
    const m = L.marker([p.lat, p.lng], {
      icon: L.divIcon({className:'',
        html:'<div class="pin-pool'+(p.stay?' is-stay':'')+'">'+p.no+'</div>',
        iconSize:[30,30], iconAnchor:[15,15]}),
      zIndexOffset: 700
    }).addTo(layPins);
    m.bindPopup(
      '<b>'+p.no+'. '+p.name+'</b><br><span class="pop-meta">'+p.area+'</span>'+
      '<hr style="border:0;border-top:1px solid #e2ded4;margin:8px 0">'+
      '新座市から <b>車'+p.drive.min+'分</b>（'+p.drive.km.toFixed(1)+'km）<br>'+
      '<span class="pop-meta">'+p.season+'</span><br>'+p.pool+
      '<br><a href="'+p.site+'" target="_blank" rel="noopener">公式サイト</a>'+
      ' ／ <a href="'+p.tagUrl+'" target="_blank" rel="noopener">Instagram</a>');
    m.bindTooltip(p.name, {permanent:true, direction:'right', offset:[10,0], className:'tip-pool'});
    m.on('click', () => select(p.no, false));
    markers[p.no] = m;
    routes[p.no] = L.polyline(p.route, {color:'#d92d20', weight:4, opacity:.85});
  });

  // 広域表示だと施設名ラベルが重なって読めないので、ズーム10以上でだけ表示する
  const LABEL_ZOOM = 10;
  function syncLabels(){
    mapEl.classList.toggle('hide-labels', map.getZoom() < LABEL_ZOOM);
  }
  map.on('zoomend', syncLabels);

  const boundsAll = L.latLngBounds(
    P.map(p=>[p.lat,p.lng]).concat([[D.origin.lat, D.origin.lng]])).pad(0.08);
  map.fitBounds(boundsAll);
  syncLabels();
  document.getElementById('fit-all').addEventListener('click', () => map.fitBounds(boundsAll));
  document.getElementById('clear-route').addEventListener('click', clearRoute);

  function clearRoute(){
    layRoute.clearLayers();
    document.querySelectorAll('.pin-pool').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('#tbody tr,.card').forEach(x=>x.classList.remove('active'));
  }

  function select(no, scrollToCard){
    clearRoute();
    const p = P.find(x => x.no === no);
    const m = markers[no];
    if (p && m){
      routes[no].addTo(layRoute);
      map.fitBounds(routes[no].getBounds().pad(0.12));
      m.openPopup();
      const icon = m.getElement() && m.getElement().querySelector('.pin-pool');
      if (icon) icon.classList.add('active');
    }
    document.querySelectorAll('#tbody tr').forEach(tr =>
      tr.classList.toggle('active', tr.dataset.no === String(no)));
    document.querySelectorAll('.card').forEach(c =>
      c.classList.toggle('active', c.dataset.no === String(no)));
    if (scrollToCard){
      const card = document.getElementById('pool-'+no);
      if (card) card.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  /* ================= 絞り込み ================= */
  const TEST = {
    all: () => true,
    stay: p => p.stay,
    day: p => !p.stay,
    year: p => yearRound(p),
    now: p => openNow(p),
  };
  // チップの件数はデータから数える（手書きするとデータ更新時にずれるため）
  document.querySelectorAll('#filters .chip').forEach(btn => {
    const cnt = btn.querySelector('.cnt');
    if (cnt) cnt.textContent = '（' + P.filter(TEST[btn.dataset.filter]).length + '）';
  });
  document.querySelectorAll('#filters .chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filters .chip').forEach(b => b.classList.toggle('is-on', b===btn));
      const t = TEST[btn.dataset.filter];
      const shown = [];
      P.forEach(p => {
        const ok = t(p);
        const tr = document.querySelector('#tbody tr[data-no="'+p.no+'"]');
        const cd = document.getElementById('pool-'+p.no);
        if (tr) tr.classList.toggle('is-hidden', !ok);
        if (cd) cd.classList.toggle('is-hidden', !ok);
        ok ? (markers[p.no].addTo(layPins), shown.push(p)) : layPins.removeLayer(markers[p.no]);
      });
      clearRoute();
      if (shown.length) {
        map.fitBounds(L.latLngBounds(
          shown.map(p=>[p.lat,p.lng]).concat([[D.origin.lat,D.origin.lng]])).pad(0.08));
      }
    });
  });
})();
