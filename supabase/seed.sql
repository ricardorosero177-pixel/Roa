-- Datos iniciales de RÖA: los productos, artículos y reseñas que ya tenía la tienda.
-- Ejecuta este archivo en Supabase DESPUÉS de schema.sql, una sola vez.
-- Si un registro ya existe, no se modifica (on conflict do nothing).

insert into public.products (id, slug, name, price, image, category_slug, short_description, description, featured, stock, active, sort_order) values
  (144044, 'florero-pequeno-minimalista-nordico', 'Florero pequeño minimalista nórdico', 2990, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121504397357-d7881e31-793b-436f-88f7-c27a5beb7afc-md.jpg', 'hogar-y-decoracion', 'Florero de líneas limpias, ideal para rincones serenos.', 'Florero pequeño de inspiración nórdica, perfecto para una flor seca o un ramo minimalista. Su forma sobria aporta equilibrio a repisas, escritorios y mesas de centro.', true, 20, true, 0),
  (144045, 'florero-grande-minimalista-nordico', 'Florero grande minimalista nórdico', 3990, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121509086205-54419f5f-c6f8-4bd6-be4e-eddc94baf641-md.jpg', 'hogar-y-decoracion', 'Presencia elegante para ramos y pampas.', 'Florero grande de estilo nórdico que se vuelve protagonista de cualquier espacio. Perfecto para ramos de pampas o flores secas que aportan calidez y altura a la decoración.', true, 15, true, 1),
  (144046, 'escultura-decorativa-ala-en-elevacion', 'Escultura decorativa ala en elevación', 5990, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121510237397-55804908-30ca-45db-ae01-15717d498223-md.jpg', 'hogar-y-decoracion', 'Una pieza escultórica que transmite movimiento.', 'Escultura decorativa con forma de ala en elevación. Un objeto con intención que aporta un acento artístico y sofisticado a libreros, mesas y recibidores.', true, 10, true, 2),
  (144047, 'escultura-decorativa-mariposa-corazon', 'Escultura decorativa mariposa corazón', 4590, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121519016656-088cbd0c-6bac-434c-9550-f95e6c8eb6c0-md.jpg', 'hogar-y-decoracion', 'Delicadeza y emoción en una sola figura.', 'Figura escultórica que combina mariposa y corazón, símbolo de transformación y afecto. Un detalle tierno y elegante para regalar o para tus propios espacios.', false, 12, true, 3),
  (144048, 'figura-decorativa-piramide-moderna', 'Figura decorativa pirámide moderna', 4190, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121528062636-1768240969446.jpg', 'hogar-y-decoracion', 'Geometría serena de estilo contemporáneo.', 'Figura geométrica en forma de pirámide, de estética moderna y minimalista. Aporta orden visual y un aire arquitectónico a tus repisas y escritorios.', false, 14, true, 4),
  (144049, 'escultura-decorativa-acostada-ala-dorada', 'Escultura decorativa acostada ala dorada', 5990, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121530353585-1768241001912.jpg', 'hogar-y-decoracion', 'Acento dorado de líneas suaves.', 'Escultura decorativa acostada con detalle en dorado. Su acabado cálido realza mesas de centro y estanterías con un toque de lujo discreto.', false, 8, true, 5),
  (144050, 'figura-decorativa-perro-grande-dorado', 'Figura decorativa perro grande dorado', 8690, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121540383299-1768241018588.jpg', 'hogar-y-decoracion', 'Pieza statement en acabado dorado.', 'Figura decorativa de perro en tamaño grande con acabado dorado. Una pieza con personalidad que se convierte en punto focal de living o recibidor.', true, 6, true, 6),
  (144051, 'figura-decorativa-perro-dorado-pequeno', 'Figura decorativa perro dorado pequeño', 3990, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121539532301-1768240981200.jpg', 'hogar-y-decoracion', 'El detalle dorado en formato compacto.', 'Versión pequeña de la figura decorativa de perro dorado. Ideal para sumar un acento cálido en repisas, escritorios o mesas auxiliares.', false, 10, true, 7),
  (144053, 'escultura-decorativa-corazon-moderno', 'Escultura decorativa corazón moderno', 4990, 'https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121537331186-1768241052915.jpg', 'hogar-y-decoracion', 'Un corazón de líneas limpias y actuales.', 'Escultura de corazón con diseño moderno y minimalista. Un símbolo cálido que aporta emoción sin recargar la decoración.', false, 12, true, 8)
on conflict (id) do nothing;

insert into public.posts (slug, title, excerpt, category, date, cover, reading_minutes, content, published) values
  ('cuando-el-hogar-se-convierte-en-experiencia', 'Cuando el hogar se convierte en experiencia', 'El hogar refleja a quien lo habita. Te contamos por qué los detalles correctos transforman un espacio en un refugio.', 'Bienestar', '2026-01-16', 'https://d2uil25qo43m6t.cloudfront.net/t/w_1200,h_675,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121504397357-d7881e31-793b-436f-88f7-c27a5beb7afc-md.jpg', 4, 'En RÖA creemos que la casa es mucho más que un lugar donde vivir: es el reflejo de quien la habita. Cada rincón cuenta una historia, y los objetos que elegimos tienen el poder de transformar un espacio en una experiencia.

La decoración recargada y las modas pasajeras saturan. Nosotros preferimos lo contrario: diseños simples, colores neutros y piezas que se integran de forma natural, aportando equilibrio y sentido en vez de ruido visual.

Un florero nórdico, una escultura de líneas limpias o un pequeño detalle dorado pueden cambiar por completo la energía de una habitación. No se trata de llenar, sino de elegir con intención.

En un mundo acelerado, el hogar debería ser un refugio: un lugar para descansar, recuperar el ánimo y volver a conectar contigo. Ese es el espíritu de cada pieza que creamos.

En este blog compartiremos inspiración, ideas de decoración, nuevos lanzamientos y la historia detrás de la marca. Bienvenida y bienvenido a la comunidad RÖA.', true),
  ('5-detalles-minimalistas-que-transforman-tu-living', '5 detalles minimalistas que transforman tu living', 'Pequeños cambios, gran impacto. Cinco ideas simples y económicas para renovar tu living sin reformas.', 'Ideas de decoración', '2026-02-03', 'https://d2uil25qo43m6t.cloudfront.net/t/w_1200,h_675,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121510237397-55804908-30ca-45db-ae01-15717d498223-md.jpg', 5, 'No necesitas una gran inversión para renovar tu espacio. A veces, los detalles correctos logran más que un mueble nuevo. Aquí van cinco ideas que puedes aplicar hoy.

1. Un punto focal escultórico. Una pieza decorativa con carácter, como una escultura de ala o un corazón moderno, atrae la mirada y ordena visualmente la habitación.

2. Floreros con flores secas. Aportan textura y calidez sin el mantenimiento de las flores frescas. Un florero nórdico grande da altura; uno pequeño, equilibrio.

3. Acentos dorados con medida. Un detalle dorado suma lujo discreto. La clave es la moderación: uno o dos puntos, no más.

4. Paleta neutra y coherente. Beige, crema, blanco y tonos tierra generan calma. Deja que los objetos hablen por su forma, no por el color.

5. Espacio para respirar. El minimalismo no es vacío, es intención. Deja aire alrededor de cada pieza para que luzca.

Con estos cinco gestos, tu living pasa de ordinario a acogedor sin gastar de más. Esa es la filosofía RÖA.', true),
  ('como-elegir-el-florero-perfecto-para-cada-espacio', 'Cómo elegir el florero perfecto para cada espacio', 'Tamaño, forma y ubicación: la guía RÖA para acertar con el florero según cada rincón de tu casa.', 'Guías', '2026-02-20', 'https://d2uil25qo43m6t.cloudfront.net/t/w_1200,h_675,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos/202601121509086205-54419f5f-c6f8-4bd6-be4e-eddc94baf641-md.jpg', 4, 'El florero es uno de los objetos decorativos más versátiles. Bien elegido, se convierte en el detalle que une toda una habitación. Aquí te ayudamos a acertar.

Para mesas de centro y escritorios, un florero pequeño de líneas nórdicas aporta equilibrio sin robar protagonismo. Es ideal para una sola flor o un ramo delicado.

Para rincones de piso o repisas altas, un florero grande con pampas o flores secas genera altura y presencia. Funciona de maravilla en recibidores.

La forma importa: las líneas rectas transmiten orden y modernidad; las curvas, suavidad y calidez. Elige según la energía que quieras dar al espacio.

Y recuerda la regla de oro del minimalismo: menos, pero mejor. Un florero con intención vale más que diez objetos sin propósito.', true)
on conflict (slug) do nothing;

insert into public.reviews (id, name, text, rating, visible, sort_order) values
  (1, 'Camila Rojas', 'Tuve dudas al principio pero todo salió bien. Me escribieron para coordinar y la entrega fue sin problema, lo recomiendo.', 5, true, 0),
  (2, 'Evelyn', 'Muy buena, me llegaron y hermosos los productos.', 5, true, 1),
  (3, 'Javiera Sandoval', 'Me encantó el de corazón, se ve muy hermoso en mi pieza. ¡Me encanta!', 5, true, 2),
  (4, 'Kendris Grijalva', 'Me encantó el florero 😍 es tal cual como en la foto, súper lindo. Le dio un toque muy bonito a mi espacio. ¡Lo recomiendo!', 5, true, 3)
on conflict (id) do nothing;

-- Los ids nuevos siguen después de los existentes.
select setval(pg_get_serial_sequence('public.reviews', 'id'), (select max(id) from public.reviews));
