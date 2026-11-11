/* =========================================================
   RECETAS PREDEFINIDAS
   Se cargan automáticamente en el recetario.
   Puedes añadir más: usa IDs únicos que empiecen por "seed-".
   ========================================================= */

const SEED_RECIPES = [
  {
    id: 'seed-coctel-atun',
    name: 'Cóctel de atún',
    category: 'Aperitivos',
    description: 'Cóctel de atún con piña y cebolla',
    portions: '4 personas',
    rating: 4,
    ingredients: [
      { name: 'Atún en aceite', measure: '2 latas (160 g)' },
      { name: 'Piña en almíbar', measure: '4 rodajas' },
      { name: 'Cebolla morada', measure: '½ unidad' },
      { name: 'Mayonesa', measure: '3 cucharadas' },
      { name: 'Tomate', measure: '1 unidad' },
      { name: 'Lechuga', measure: '4 hojas' },
      { name: 'Sal y pimienta', measure: 'Al gusto' }
    ],
    steps: `Paso 1: Escurre bien el atún y desmenúzalo con un tenedor.
Paso 2: Corta la piña en cubos pequeños y la cebolla en brunoise fina.
Paso 3: Mezcla en un bol el atún, la piña y la cebolla.
Paso 4: Añade la mayonesa y remueve con cuidado hasta integrar.
Paso 5: Salpimenta al gusto y deja reposar 30 minutos en la nevera.
Paso 6: Sirve sobre hojas de lechuga y decora con tomate en rodajas.`,
    notes: 'Dejar reposar mejora el sabor. Puedes sustituir la mayonesa por yogur griego para una versión más ligera.'
  },
  {
    id: 'seed-pasta-carbonara',
    name: 'Pasta carbonara',
    category: 'Comidas',
    description: 'Carbonara romana auténtica, sin nata',
    portions: '4 personas',
    rating: 5,
    ingredients: [
      { name: 'Spaghetti', measure: '400 g' },
      { name: 'Panceta o guanciale', measure: '150 g' },
      { name: 'Yemas de huevo', measure: '4 unidades' },
      { name: 'Queso pecorino rallado', measure: '80 g' },
      { name: 'Pimienta negra recién molida', measure: 'Al gusto' },
      { name: 'Sal', measure: 'Para el agua' }
    ],
    steps: `Paso 1: Pon a hervir abundante agua con sal.
Paso 2: Corta la panceta en tiras y dórala en una sartén sin aceite.
Paso 3: En un bol, bate las yemas con el queso y abundante pimienta.
Paso 4: Cuece la pasta al dente y reserva un poco del agua de cocción.
Paso 5: Mezcla la pasta con la panceta fuera del fuego.
Paso 6: Añade la mezcla de huevo y queso removiendo rápido; si espesa demasiado, añade un poco de agua de cocción.
Paso 7: Sirve inmediatamente con más queso y pimienta.`,
    notes: 'Nunca añadas nata: el calor residual de la pasta cuaja el huevo. Usa pecorino romano para el sabor auténtico.'
  },
  {
    id: 'seed-pollo-ajillo',
    name: 'Pollo al ajillo',
    category: 'Carnes',
    description: 'Pollo dorado con ajos enteros y vino blanco',
    portions: '4 personas',
    rating: 4,
    ingredients: [
      { name: 'Pollo troceado', measure: '1 kg' },
      { name: 'Ajos enteros con piel', measure: '10 dientes' },
      { name: 'Vino blanco', measure: '150 ml' },
      { name: 'Aceite de oliva virgen', measure: '4 cucharadas' },
      { name: 'Perejil fresco', measure: '1 manojo' },
      { name: 'Laurel', measure: '2 hojas' },
      { name: 'Sal y pimienta', measure: 'Al gusto' }
    ],
    steps: `Paso 1: Salpimenta el pollo y dóralo en una cazuela con aceite a fuego fuerte.
Paso 2: Retira el pollo y sofríe los ajos enteros hasta que se doren ligeramente.
Paso 3: Vuelve a poner el pollo, añade el vino blanco y las hojas de laurel.
Paso 4: Tapa y cocina a fuego medio-bajo durante 20-25 minutos.
Paso 5: Destapa los últimos 5 minutos para que reduzca la salsa.
Paso 6: Espolvorea perejil picado y sirve caliente.`,
    notes: 'Deja los ajos enteros con piel: quedan melosos y perfuman todo el guiso. Ideal con patatas panadera.'
  },
  {
    id: 'seed-salmon-plancha',
    name: 'Salmón a la plancha',
    category: 'Pescados',
    description: 'Salmón con piel crujiente y limón',
    portions: '2 personas',
    rating: 4,
    ingredients: [
      { name: 'Lomos de salmón', measure: '2 unidades (180 g cada uno)' },
      { name: 'Limón', measure: '1 unidad' },
      { name: 'Aceite de oliva', measure: '2 cucharadas' },
      { name: 'Eneldo fresco', measure: '1 ramita' },
      { name: 'Sal', measure: 'Al gusto' },
      { name: 'Pimienta negra', measure: 'Al gusto' }
    ],
    steps: `Paso 1: Seca bien los lomos con papel de cocina.
Paso 2: Calienta una plancha o sartén a fuego medio-alto con un poco de aceite.
Paso 3: Coloca el salmón con la piel hacia abajo y presiona ligeramente.
Paso 4: Cocina 3-4 minutos sin mover hasta que la piel esté crujiente.
Paso 5: Da la vuelta y cocina 1-2 minutos más por el otro lado.
Paso 6: Sirve con rodajas de limón y un poco de eneldo picado.`,
    notes: 'La piel hacia abajo y sin moverla es la clave para que quede crujiente. No lo cocines en exceso: el centro debe quedar jugoso.'
  },
  {
    id: 'seed-ensalada-cesar',
    name: 'Ensalada César',
    category: 'Ensaladas',
    description: 'Lechuga romana, pollo, parmesano y salsa césar',
    portions: '4 personas',
    rating: 3,
    ingredients: [
      { name: 'Lechuga romana', measure: '1 unidad grande' },
      { name: 'Pechuga de pollo', measure: '2 unidades' },
      { name: 'Pan del día anterior', measure: '2 rebanadas' },
      { name: 'Queso parmesano', measure: '50 g' },
      { name: 'Salsa César', measure: '4 cucharadas' },
      { name: 'Anchoas en aceite', measure: '4 filetes' },
      { name: 'Aceite de oliva', measure: '2 cucharadas' }
    ],
    steps: `Paso 1: Corta el pan en cubos y tuéstalos en una sartén con un poco de aceite.
Paso 2: Cocina las pechugas a la plancha, salpimentadas, y córtalas en tiras.
Paso 3: Lava y trocea la lechuga romana en un bol grande.
Paso 4: Añade el pollo, los picatostes y los filetes de anchoa.
Paso 5: Aliña con la salsa César y mezcla bien.
Paso 6: Ralla parmesano por encima y sirve de inmediato.`,
    notes: 'Adereza justo antes de servir para que la lechuga no se ablande. Puedes hacer la salsa César casera con anchoas, yema, ajo y limón.'
  },
  {
    id: 'seed-gazpacho',
    name: 'Gazpacho andaluz',
    category: 'Sopas',
    description: 'Sopa fría de tomate, pepino y pimiento',
    portions: '4 personas',
    rating: 5,
    ingredients: [
      { name: 'Tomates maduros', measure: '1 kg' },
      { name: 'Pepino', measure: '1 unidad' },
      { name: 'Pimiento verde', measure: '1 unidad' },
      { name: 'Ajo', measure: '1 diente' },
      { name: 'Pan del día anterior', measure: '50 g' },
      { name: 'Aceite de oliva virgen', measure: '80 ml' },
      { name: 'Vinagre de vino', measure: '1 cucharada' },
      { name: 'Sal', measure: 'Al gusto' }
    ],
    steps: `Paso 1: Lava y trocea los tomates, el pepino y el pimiento (pela el pepino).
Paso 2: Remoja el pan en agua unos minutos y escúrrelo.
Paso 3: Tritura todos los ingredientes con la batidora hasta obtener una crema fina.
Paso 4: Añade el aceite poco a poco sin dejar de batir para emulsionar.
Paso 5: Cuela si quieres una textura más fina.
Paso 6: Refrigera al menos 2 horas antes de servir.`,
    notes: 'Está mejor de un día para otro. Sirve muy frío con guarnición de pepino, cebolla y picatostes picados.'
  },
  {
    id: 'seed-tortitas',
    name: 'Tortitas americanas',
    category: 'Desayunos',
    description: 'Pancakes esponjosos con sirope de arce',
    portions: '4 personas · 12 tortitas',
    rating: 5,
    ingredients: [
      { name: 'Harina de trigo', measure: '250 g' },
      { name: 'Huevos', measure: '2 unidades' },
      { name: 'Leche entera', measure: '300 ml' },
      { name: 'Azúcar', measure: '2 cucharadas' },
      { name: 'Levadura en polvo', measure: '2 cucharaditas' },
      { name: 'Mantequilla derretida', measure: '30 g' },
      { name: 'Sirope de arce', measure: 'Al gusto' }
    ],
    steps: `Paso 1: Mezcla en un bol la harina, el azúcar y la levadura.
Paso 2: En otro bol bate los huevos con la leche y la mantequilla.
Paso 3: Une ambas mezclas sin batir en exceso; deben quedar algunos grumos.
Paso 4: Deja reposar la masa 10 minutos.
Paso 5: Cocina cucharones en una sartén caliente engrasada, 2 minutos por cada lado.
Paso 6: Sirve apiladas con sirope de arce y frutas al gusto.`,
    notes: 'No batas demasiado: los grumos hacen que queden más esponjosas. La masa reposada sube mejor.'
  },
  {
    id: 'seed-tarta-queso',
    name: 'Tarta de queso al horno',
    category: 'Postres',
    description: 'Cheesecake cremosa con base de mantequilla',
    portions: '8 personas',
    rating: 5,
    ingredients: [
      { name: 'Queso crema', measure: '600 g' },
      { name: 'Huevos', measure: '4 unidades' },
      { name: 'Azúcar', measure: '180 g' },
      { name: 'Nata para montar', measure: '200 ml' },
      { name: 'Harina de trigo', measure: '30 g' },
      { name: 'Galletas tipo María', measure: '200 g' },
      { name: 'Mantequilla derretida', measure: '100 g' },
      { name: 'Mermelada de frutos rojos', measure: 'Para decorar' }
    ],
    steps: `Paso 1: Tritura las galletas y mézclalas con la mantequilla derretida.
Paso 2: Forra el fondo de un molde desmontable con la mezcla y presiona bien.
Paso 3: Bate el queso con el azúcar hasta que no queden grumos.
Paso 4: Añade los huevos uno a uno, luego la nata y por último la harina.
Paso 5: Vierte sobre la base y hornea 45 minutos a 180 °C.
Paso 6: Deja enfriar dentro del horno apagado y luego refrigera 4 horas.
Paso 7: Desmolda y decora con mermelada.`,
    notes: 'El centro debe quedar ligeramente tembloroso al salir del horno: cuaja al enfriarse. Está mejor de un día para otro.'
  },
  {
    id: 'seed-mojito',
    name: 'Mojito clásico',
    category: 'Cócteles',
    description: 'Ron blanco, lima y hierbabuena',
    portions: '1 persona',
    rating: 4,
    ingredients: [
      { name: 'Ron blanco', measure: '50 ml' },
      { name: 'Lima', measure: '1 unidad' },
      { name: 'Hierbabuena fresca', measure: '8 hojas' },
      { name: 'Azúcar blanco', measure: '2 cucharaditas' },
      { name: 'Sifón o agua con gas', measure: '100 ml' },
      { name: 'Hielo picado', measure: 'Al gusto' }
    ],
    steps: `Paso 1: Pon en el vaso las hojas de hierbabuena con el azúcar y el zumo de media lima.
Paso 2: Machaca suavemente con un mortero (no triturar en exceso).
Paso 3: Añade el ron y remueve.
Paso 4: Llena el vaso de hielo picado.
Paso 5: Completa con el sifón y remueve de abajo hacia arriba.
Paso 6: Decora con una rodaja de lima y una ramita de hierbabuena.`,
    notes: 'No machaques demasiado la hierbabuena: si se rompe en exceso, el cóctel amarga. Sirve en vaso alto bien frío.'
  },
  {
    id: 'seed-sangria',
    name: 'Sangría de verano',
    category: 'Bebidas',
    description: 'Vino tinto con frutas y un toque de canela',
    portions: '6 personas',
    rating: 4,
    ingredients: [
      { name: 'Vino tinto joven', measure: '1 botella (750 ml)' },
      { name: 'Brandy', measure: '100 ml' },
      { name: 'Zumo de naranja', measure: '200 ml' },
      { name: 'Azúcar', measure: '3 cucharadas' },
      { name: 'Canela en rama', measure: '1 unidad' },
      { name: 'Naranja', measure: '1 unidad' },
      { name: 'Limón', measure: '1 unidad' },
      { name: 'Melocotón', measure: '2 unidades' }
    ],
    steps: `Paso 1: En una jarra grande, disuelve el azúcar en el zumo de naranja.
Paso 2: Añade el vino tinto, el brandy y la rama de canela.
Paso 3: Lava y corta en rodajas la naranja y el limón; el melocotón en trozos.
Paso 4: Incorpora la fruta a la jarra y remueve.
Paso 5: Tapa y deja macerar en la nevera al menos 2 horas (mejor toda la noche).
Paso 6: Sirve muy fría con hielo y un poco de la fruta macerada.`,
    notes: 'Cuanto más reposa, más sabor. Puedes añadir otras frutas de temporada: fresas, manzana o piña funcionan genial.'
  }
]; 