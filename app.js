/* =========================================================
   RECETARIO · Lógica
   Usa manifest.json estático (no se genera en runtime)
   ========================================================= */

const STORAGE_KEY = 'recetario.recipes.v3';
const DELETED_SEEDS_KEY = 'recetario.deletedSeeds.v1';

const CATEGORIES = {
  'Aperitivos': 'fa-cheese',
  'Bebidas':    'fa-mug-hot',
  'Carnes':     'fa-drumstick-bite',
  'Cócteles':   'fa-martini-glass',
  'Comidas':    'fa-utensils',
  'Desayunos':  'fa-mug-saucer',
  'Ensaladas':  'fa-leaf',
  'Otros':      'fa-bowl-food',
  'Pescados':   'fa-fish',
  'Postres':    'fa-cake-candles',
  'Sopas':      'fa-bowl-rice'
};

const state = {
  recipes: [],
  view: 'create',
  rating: 5,
  search: '',
  openCards: new Set(),
  editingId: null,
  expandedCats: new Set()   // categorías abiertas manualmente en esta sesión
};

const $  = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* ---------- Utilidades ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));

const catIcon = (cat) =>
  `<i class="fa-solid ${CATEGORIES[cat] || 'fa-utensils'}" aria-hidden="true"></i>`;

const sortedCategories = () =>
  Object.keys(CATEGORIES).sort((a, b) => a.localeCompare(b, 'es'));

/* ---------- Persistencia ---------- */
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    state.recipes = Array.isArray(raw) ? raw : [];
  } catch {
    state.recipes = [];
  }
}
function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.recipes));
}

/* ---------- Recetas predefinidas ---------- */
function getDeletedSeeds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(DELETED_SEEDS_KEY) || '[]'));
  } catch {
    return new Set();
  }
}
function markSeedDeleted(id) {
  const set = getDeletedSeeds();
  set.add(id);
  localStorage.setItem(DELETED_SEEDS_KEY, JSON.stringify([...set]));
}

function loadSeedRecipes() {
  if (typeof SEED_RECIPES === 'undefined' || !Array.isArray(SEED_RECIPES)) return;

  const deleted  = getDeletedSeeds();
  const existing = new Set(state.recipes.map((r) => r.id));
  let added = 0;

  for (const seed of SEED_RECIPES) {
    if (deleted.has(seed.id) || existing.has(seed.id)) continue;
    state.recipes.push({
      ...seed,
      ingredients: (seed.ingredients || []).map((i) => ({ ...i })),
      createdAt: seed.createdAt || Date.now()
    });
    added++;
  }

  if (added > 0) persist();
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
}

/* =========================================================
   VISTA CREAR / EDITAR
   ========================================================= */

function renderStars() {
  const box = $('#stars');
  box.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'star' + (i <= state.rating ? ' on' : '');
    b.setAttribute('aria-label', `${i} de 5 estrellas`);
    b.setAttribute('aria-checked', i === state.rating);
    b.setAttribute('role', 'radio');
    b.innerHTML = `<i class="${i <= state.rating ? 'fa-solid' : 'fa-regular'} fa-star" aria-hidden="true"></i>`;
    b.addEventListener('click', () => {
      state.rating = i;
      renderStars();
    });
    box.appendChild(b);
  }
}

function addIngredientRow(name = '', measure = '') {
  const row = document.createElement('div');
  row.className = 'ing-row';
  row.innerHTML = `
    <input class="ing-name"    type="text" placeholder="Ingrediente"
           value="${escapeHtml(name)}" aria-label="Ingrediente">
    <input class="ing-measure" type="text" placeholder="Cantidad"
           value="${escapeHtml(measure)}" aria-label="Cantidad">
    <button type="button" class="ing-remove" aria-label="Quitar ingrediente">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  `;
  row.querySelector('.ing-remove').addEventListener('click', () => {
    row.remove();
    if (!$$('#ingredients .ing-row').length) addIngredientRow();
  });
  $('#ingredients').appendChild(row);
}

function hasFormContent() {
  return !!(
    $('#name').value.trim() ||
    $('#portions').value.trim() ||
    $('#desc').value.trim() ||
    $('#steps').value.trim() ||
    $('#notes').value.trim() ||
    $$('#ingredients .ing-row').some(r =>
      r.querySelector('.ing-name').value.trim() ||
      r.querySelector('.ing-measure').value.trim()
    )
  );
}

function resetForm() {
  $('#recipeForm').reset();
  $('#category').value = 'Comidas';
  state.rating = 5;
  state.editingId = null;
  renderStars();
  $('#ingredients').innerHTML = '';
  addIngredientRow();
  $('#editBanner').hidden = true;
  $('#submitBtn').innerHTML =
    '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i><span>Guardar receta</span>';
}

function handleSubmit(e) {
  e.preventDefault();

  const name = $('#name').value.trim();
  if (!name) {
    toast('Ponle un nombre a la receta');
    $('#name').focus();
    return;
  }

  const ingredients = $$('#ingredients .ing-row')
    .map((r) => ({
      name:    r.querySelector('.ing-name').value.trim(),
      measure: r.querySelector('.ing-measure').value.trim()
    }))
    .filter((i) => i.name || i.measure);

  const data = {
    name,
    category:    $('#category').value,
    portions:    $('#portions').value.trim(),
    description: $('#desc').value.trim() || name,
    ingredients,
    steps:       $('#steps').value.trim(),
    notes:       $('#notes').value.trim(),
    rating:      state.rating
  };

  if (state.editingId) {
    const idx = state.recipes.findIndex((r) => r.id === state.editingId);
    if (idx !== -1) {
      state.recipes[idx] = {
        ...state.recipes[idx],
        ...data,
        updatedAt: Date.now()
      };
    }
    toast('Cambios guardados');
  } else {
    state.recipes.push({ id: uid(), ...data, createdAt: Date.now() });
    toast('Receta guardada');
  }

  persist();
  resetForm();
  switchView('book');
  renderBook();
}

function editRecipe(id) {
  const r = state.recipes.find((x) => x.id === id);
  if (!r) return;

  if (state.editingId !== id && hasFormContent()) {
    if (!confirm('Ya hay contenido en el formulario. ¿Reemplazarlo con esta receta?')) return;
  }

  state.editingId = id;
  $('#name').value = r.name;
  $('#category').value = r.category;
  $('#portions').value = r.portions || '';
  $('#desc').value = r.description;
  $('#steps').value = r.steps || '';
  $('#notes').value = r.notes || '';
  state.rating = r.rating || 0;
  renderStars();

  $('#ingredients').innerHTML = '';
  if (r.ingredients && r.ingredients.length) {
    r.ingredients.forEach((i) => addIngredientRow(i.name, i.measure));
  } else {
    addIngredientRow();
  }

  $('#editBanner').hidden = false;
  $('#editName').textContent = r.name;
  $('#submitBtn').innerHTML =
    '<i class="fa-solid fa-check" aria-hidden="true"></i><span>Guardar cambios</span>';

  switchView('create');
  $('#views').scrollTop = 0;
}

function cancelEdit() {
  resetForm();
  toast('Edición cancelada');
}

/* =========================================================
   VISTA LIBRO
   ========================================================= */

function renderBook() {
  const content = $('#bookContent');
  const q = state.search.toLowerCase().trim();
  const isSearching = q.length > 0;

  const filtered = state.recipes.filter((r) => {
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.notes || '').toLowerCase().includes(q) ||
      (r.portions || '').toLowerCase().includes(q) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  if (!filtered.length) {
    content.innerHTML = `
      <div class="empty">
        <span class="empty-mark"><i class="fa-solid fa-book-open" aria-hidden="true"></i></span>
        <h3>${state.recipes.length ? 'Sin coincidencias' : 'Tu recetario está vacío'}</h3>
        <p>${state.recipes.length
          ? 'Prueba con otra búsqueda o revisa la ortografía.'
          : 'Cuando crees tu primera receta aparecerá aquí, ordenada por categorías.'}</p>
      </div>`;
    return;
  }

  const groups = {};
  filtered.forEach((r) => (groups[r.category] ||= []).push(r));

  content.innerHTML = '';

  Object.keys(groups)
    .sort((a, b) => a.localeCompare(b, 'es'))
    .forEach((cat) => {
      const list = groups[cat].sort((a, b) => a.name.localeCompare(b.name, 'es'));

      // Colapsadas por defecto. Expandidas solo si hay búsqueda activa
      // o si el usuario las abrió manualmente en esta sesión.
      const shouldExpand = isSearching || state.expandedCats.has(cat);

      const section = document.createElement('section');
      section.className = 'cat' + (shouldExpand ? '' : ' collapsed');

      const head = document.createElement('button');
      head.type = 'button';
      head.className = 'cat-head';
      head.setAttribute('aria-expanded', String(shouldExpand));
      head.innerHTML = `
        <span class="cat-icon">${catIcon(cat)}</span>
        <span class="cat-name">${escapeHtml(cat)}</span>
        <span class="cat-count">${list.length}</span>
        <span class="cat-arrow"><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></span>
      `;

      head.addEventListener('click', () => {
        const nowCollapsed = section.classList.toggle('collapsed');
        head.setAttribute('aria-expanded', String(!nowCollapsed));
        if (!isSearching) {
          if (nowCollapsed) state.expandedCats.delete(cat);
          else              state.expandedCats.add(cat);
        }
      });

      const body = document.createElement('div');
      body.className = 'cat-body';
      list.forEach((r) => body.appendChild(renderRecipeCard(r)));

      section.append(head, body);
      content.appendChild(section);
    });
}

function renderRecipeCard(r) {
  const card = document.createElement('article');
  card.className = 'recipe' + (state.openCards.has(r.id) ? ' open' : '');

  const stars = Array.from({ length: 5 }, (_, i) =>
    `<i class="${i < r.rating ? 'fa-solid' : 'fa-regular'} fa-star" aria-hidden="true"></i>`
  ).join('');

  const ingHtml = r.ingredients.length
    ? `<ul class="ing-list">${r.ingredients.map((i) => `
        <li>
          <span>${escapeHtml(i.name)}</span>
          <span class="ing-measure">${escapeHtml(i.measure)}</span>
        </li>`).join('')}</ul>`
    : '<p class="muted">Sin ingredientes</p>';

  const portionsHtml = r.portions
    ? ` <span class="recipe-portions">· ${escapeHtml(r.portions)}</span>`
    : '';

  const notesHtml = r.notes
    ? `<h4>Notas</h4><p class="notes">${escapeHtml(r.notes)}</p>`
    : '';

  card.innerHTML = `
    <div class="recipe-head">
      <div class="recipe-icon">${catIcon(r.category)}</div>
      <div class="recipe-info">
        <h3 class="recipe-name">${escapeHtml(r.name)}</h3>
        <p class="recipe-desc">${escapeHtml(r.description)}</p>
      </div>
      <div class="recipe-stars" title="${r.rating} de 5">${stars}</div>
    </div>
    <div class="recipe-body">
      <h4>Ingredientes${portionsHtml}</h4>
      ${ingHtml}
      <h4>Preparación</h4>
      ${r.steps
        ? `<p class="steps">${escapeHtml(r.steps)}</p>`
        : '<p class="muted">Sin preparación</p>'}
      ${notesHtml}
      <div class="recipe-actions">
        <button type="button" class="btn-action edit">
          <i class="fa-solid fa-pen" aria-hidden="true"></i><span>Editar</span>
        </button>
        <button type="button" class="btn-action danger delete">
          <i class="fa-solid fa-trash-can" aria-hidden="true"></i><span>Eliminar</span>
        </button>
      </div>
    </div>
  `;

  card.querySelector('.recipe-head').addEventListener('click', () => {
    if (state.openCards.has(r.id)) state.openCards.delete(r.id);
    else state.openCards.add(r.id);
    card.classList.toggle('open');
  });

  card.querySelector('.edit').addEventListener('click', (e) => {
    e.stopPropagation();
    editRecipe(r.id);
  });

  card.querySelector('.delete').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar "${r.name}"?`)) return;

    if (typeof SEED_RECIPES !== 'undefined' &&
        SEED_RECIPES.some((s) => s.id === r.id)) {
      markSeedDeleted(r.id);
    }

    state.recipes = state.recipes.filter((x) => x.id !== r.id);
    state.openCards.delete(r.id);
    if (state.editingId === r.id) resetForm();
    persist();
    renderBook();
    toast('Receta eliminada');
  });

  return card;
}

/* =========================================================
   NAVEGACIÓN
   ========================================================= */

function switchView(view) {
  if (state.view === view) return;
  state.view = view;

  $$('.view').forEach((v) => v.classList.remove('active'));
  $('#view-' + view).classList.add('active');

  $$('.navbtn').forEach((b) =>
    b.classList.toggle('active', b.dataset.view === view)
  );

  $('#navIndicator').classList.toggle('pos-1', view === 'book');

  $('#brandSub').textContent =
    view === 'create' ? 'Cuaderno de cocina' : 'Índice de recetas';

  $('#views').scrollTop = 0;

  if (view === 'book') renderBook();
}

function enableSwipe() {
  let sx = 0, sy = 0, tracking = false;
  const el = $('#views');

  el.addEventListener('touchstart', (e) => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx)) return;

    if (dx < 0 && state.view === 'create') switchView('book');
    if (dx > 0 && state.view === 'book')   switchView('create');
  }, { passive: true });
}

/* =========================================================
   TECLADO → ocultar barra
   ========================================================= */

function setupKeyboardBehavior() {
  const isFormElement = (el) =>
    el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT');

  let blurTimer;

  document.addEventListener('focusin', (e) => {
    if (isFormElement(e.target)) {
      clearTimeout(blurTimer);
      document.body.classList.add('keyboard-open');
    }
  });

  document.addEventListener('focusout', () => {
    clearTimeout(blurTimer);
    blurTimer = setTimeout(() => {
      if (!isFormElement(document.activeElement)) {
        document.body.classList.remove('keyboard-open');
      }
    }, 80);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const visible = window.visualViewport.height;
      const total = window.innerHeight;
      if (total - visible > 150) {
        document.body.classList.add('keyboard-open');
      } else if (!isFormElement(document.activeElement)) {
        document.body.classList.remove('keyboard-open');
      }
    });
  }
}

/* =========================================================
   PWA — Registro + auto-actualización
   Manifest: ./manifest.json (estático)
   Icono:    ./icon.svg
   ========================================================= */

function registerPWA() {
  if (!('serviceWorker' in navigator)) return;

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    if (hasUnsavedFormData()) {
      toast('Nueva versión lista. Se aplicará al recargar.');
      return;
    }
    window.location.reload();
  });

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js', {
        updateViaCache: 'none'
      });
      setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          reg.update().catch(() => {});
        }
      });
    } catch { /* silencioso */ }
  });
}

function hasUnsavedFormData() {
  if (state.view !== 'create') return false;
  return !!(
    $('#name').value.trim() ||
    $('#portions').value.trim() ||
    $('#desc').value.trim() ||
    $('#steps').value.trim() ||
    $('#notes').value.trim()
  );
}

/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

function init() {
  load();
  loadSeedRecipes();

  const select = $('#category');
  sortedCategories().forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  select.value = 'Comidas';

  renderStars();
  addIngredientRow();
  renderBook();

  $('#recipeForm').addEventListener('submit', handleSubmit);
  $('#addIngredient').addEventListener('click', () => addIngredientRow());
  $('#cancelEdit').addEventListener('click', cancelEdit);

  $('#search').addEventListener('input', (e) => {
    state.search = e.target.value;
    renderBook();
  });

  $$('.navbtn').forEach((b) =>
    b.addEventListener('click', () => switchView(b.dataset.view))
  );

  enableSwipe();
  setupKeyboardBehavior();
  registerPWA();
}

document.addEventListener('DOMContentLoaded', init);