
<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">

# Lazy Kindler

# ✨ Características

- 🌈 Importar libros y mostrar la lista de libros eficientemente.

- 💅 Crear colecciones, como una colección de novelas de ciencia ficción o novelas de artes marciales.

- 🚀 Visualización multidimensional, muestra la lista de libros por título, autor, calificación, colección, etiquetas, etc.

- 🛡 Buscar libros utilizando cualquier palabra clave, como título, autor o editorial.

- 📦 Descargar libros a través del menú contextual con clic derecho o descargando todos los libros administrados por la plataforma.

- 🛡 Lectura de libro: la plataforma admite una función de lectura de libro.

- 📦 Función de copia de seguridad: la plataforma utiliza `sqlite3` para la base datos y almacena todos los libros en un directorio designado para facilitar su copia seguridad.

- 🎻 Importación automática notas destacadas al conectar el ordenador a `kindle`.

- 📣 Importación notas destacadas desde el apk `静读天下apk` (Jing Du Tian Xia) en dispositivos Android.

-🎺 Notas destacadas: admite "resaltado secundario" y "eliminación del resaltado secundario" para las notas importadas.

-🥁 Agregar comentarios a las notas destacadas.

-🎻 Crear colecciones para las notas destacadas y gestionarlas categoricamente.

-🚀 Kindle Vocabulary Builder: La plataforma admite importar libros,palabras y ejemplos del constructor vocabulario kindle.

# Plataformas compatibles

Actualmente solo adaptada para plataformas Mac , puede haber errores desconocidos al ejecutarla en la plataforma Windows.

# Formatos de libro electrónico compatibles

mobi y azw3. Otros tipos de libros electrónicos se ignorarán automáticamente durante la importación.

# Problema resuelto

Después de descargar ** miles** de libros electrónicos de Internet, ¿cómo los administra eficientemente?

<br />

La calidad de varios libros electrónicos varía mucho, algunos escritos por autores comunes y otros por escritores mundialmente famosos. También hay muchos géneros diferentes, como ciencia ficción, romance, fantasía y más.

<br />

Si tiene que buscar un libro en un directorio que contiene miles de libros cada vez, es doloroso para la cabeza. Por lo tanto, es necesario administrar estos libros electrónicos adecuadamente para permitirnos buscar libros dentro un rango más pequeño basado en preferencias específicas , encontrar rápidamente el libro deseado y evitar perder demasiado tiempo buscando.

<br />

`lazykindler` nació con este propósito.



# Introducción de características

## 1. Importación de libros

Haga clic en el botón `Cargar archivo`, y la plataforma escaneará recursivamente los archivos de libros electrónicos admitidos en directorios como `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc. Los archivos duplicados no se cargarán nuevamente.

<br />

Actualmente, solo se admiten los formatos `mobi` y` azw3` para la importación, y la plataforma no proporciona una función de conversión de formato de libro electrónico. Es fácil encontrar libros electrónicos en formatos específicos; generalmente los encuentro en este sitio web: http://www.fast8.com. La ventaja de este sitio es que ofrece una amplia selección de libros, y hay varias opciones disponibles al descargarlos. Simplemente descargue los libros en el formato deseado.

## 2. Agregar metadatos a los libros

Puede modificar la calificación del libro, las etiquetas, la colección, el autor, el editor y la portada. Tenga en cuenta que estas operaciones no modificarán realmente el archivo del libro sino que agregarán registros a la base de datos.

## 3. Análisis de información del libro

Después de importar libros electrónicos, la plataforma extraerá automáticamente datos del archivo para mostrar información sobre su gestión.

## 4. Colecciones

Puede crear colecciones con diferentes tipos temáticos como "Colección Ciencia Ficción", "Colección Novela Fantástica", "Colección Novela Romántica", entre otros más . Agregue portadas representativas a las colecciones que le gusten , puede darles una calificación o agregar etiquetas también . Cada colección puede tener libros seleccionados y agregados desde la biblioteca, y también puede calificarlos, agregar etiquetas y portadas a las colecciones. Una vez que tenga varias colecciones, podrá buscar libros directamente en estas colecciones en el futuro.

## 5. Visualización

Para admitir la visualización de libros desde diferentes dimensiones, puede `calificar` y `agregar etiquetas` a los libros , así como `modificar autores` y `modificar editores`. Los libros se pueden mostrar desde diversas dimensiones como "calificación", "etiquetas", "autor" y "editor". Además, puede modificar la portada del libro.

## 6. Descarga

Los libros en la plataforma se pueden descargar haciendo clic en el botón `Descargar` en la sección de operaciones de cada tarjeta de libro. Los libros descargados se guardarán en el directorio principal del usuario bajo `Download` o` 下载`. Al hacer clic en 'Descargar todos los Libros' (Download All Books)en la página principal ,se descargarán todos los archivos al directorio 'Documents' o '文稿' dentro del directorio 'lazykindler'. Hacer clic varias veces no volverá a descargar los mismos archivos existentes.

## 7. Lectura

La plataforma proporciona funciones básicas para leer libros electrónicos . Actualmente, no he encontrado una biblioteca para implementar lectura de formatos mobi and azw3 usando reactjs . Por lo tanto , cuando haga clic por primera vez en el botón Leer Libro (Read Book),la plataforma convertirá estos dos formatos al formato epub . La herramienta utilizada para esta conversión es `/Applications/calibre.app/Contents/MacOS/ebook-convert`, por lo que es necesario instalar Calibre en la computadora para usar correctamente la función de lectura del libro. La conversión solo es necesaria la primera vez que haga clic en Leer Libro (Read Book). La página puede volverse no receptiva por un corto período, lo cual es normal. El tiempo de espera depende del tamaño del libro electrónico, pero generalmente es rápido. Los libros convertidos se almacenan en el directorio `backend/data` de la plataforma principal.

<br />

## 8. Flujo de trabajo

Los libros mostrados en la página `Librería` son los libros almacenados oficialmente , mientras que los libros recién importados se muestran en la página `Temporal`. (Aparte de las diferencias entre las ubicaciones de las páginas, no hay mucha diferencia entre los libros oficiales y temporales en el backend).

<br />
Después de que se añade un libro `temporal` a cualquier colección, será movido de `Libros -> Temporales` a `Libros -> Biblioteca`. El propósito de esto es **distinguir entre los libros almacenados oficialmente y los libros temporalmente importados. Los libros almacenados oficialmente han sido filtrados, eliminando los no deseados y categorizados, mientras que los libros temporalmente importados tienden a ser diversos.**

## 9. Copia de seguridad

La base de datos utilizada es `sqlite3`, ubicada en `backend/lazykindler.db`.

<br />

Cuando la plataforma se lanza por primera vez, el archivo de la base de datos se creará e inicializará automáticamente. Este archivo contiene toda la información del sistema excepto para los libros. Los libros importados son copiados al directorio `backend/data`. Tenga en cuenta que para una operación interna más fácil del sistema, el nombre del libro en el directorio `backend/data` está seguido del valor md5 del libro.

<br />

Para hacer una copia de seguridad completa todos los libros y datos en la plataforma simplemente guarde `backend/lazykindler.db` y `backend/data`. Para iniciar el servicio en otra ubicación la próxima vez, copie  `backend/lazykindler.db` y  `backend/data` a las posiciones correspondientes.

## 10. Importar destacado Kindle

Esta función actualmente solo es compatible con Mac.

<br />

La plataforma detectará automáticamente si el dispositivo Kindle está conectado o no. Cuando esté conectado al ordenador, la plataforma importará el archivo "My Clippings.txt" desde su dispositivo Kindle para una gestión unificada y visualización multidimensional . Cuando cambie este archivo "My Clippings.txt" en el dispositivo Kindle, la plataforma importará automáticamente el contenido recién agregado en "My Clippings.txt", y los datos antiguos no se importarán repetidamente. Los usuarios pueden ver el contenido recién agregado actualizando la página después de conectar su dispositivo Kindle al ordenador.

<br />

Debe tenerse en cuenta que el dispositivo Kindle procesa las notas destacadas añadidas por los usuarios como un bloque de texto sin saltos de línea, incluso si es el contenido de varios párrafos. `lazykindler` reconoce y procesa inteligentemente los saltos de línea al importar este archivo "My Clippings.txt" del dispositivo Kindle, como se muestra a continuación.

<img src="https://user-images.githubusercontent.com/16133390/210229975-4e7145e7-5d91-4aff-85ff-f5550fd7fe2c.png" width="66%">

## 11. Realizar una segunda selección sobre las notas destacadas

Las notas destacadas son parte del texto o párrafos relacionados que resaltamos y registramos cuando leemos un libro, a menudo porque una oración o palabra tiene cierto impacto en nosotros. Después de importar estas notas destacadas a la plataforma, es necesario seleccionar las frases o palabras que resonaron contigo durante el proceso posterior para facilitar su visualización.

<br />

Con `lazykindler`, puede realizar fácilmente esta segunda selección. Simplemente seleccione el texto relevante y haga clic en `OK` en la ventana emergente.

<img src="https://user-images.githubusercontent.com/16133390/210230077-c9a4532b-aafc-4ba2-a163-cd151c98d831.png" width="66%">

## 12. Añadir comentarios a las notas destacadas

Puede registrar algunos pensamientos sobre el texto que resonó contigo.

<img width="1379" alt="Xnip2023-02-05_15-19-18" src="https://user-images.githubusercontent.com/16133390/216806787-4b76a541-608d-4e8e-9d8e-2651bf7842ef.png">

## 13. Importar destacados de Jingdu Tianxia apk

`Jingdu Tianxia apk` es un lector popular en la plataforma Android. Actualmente uso este software para leer libros en Hisense e-reader, y el software también admite agregar notas resaltadas. Por lo tanto, agregué soporte para importar notas resaltadas desde este software.
<br />
El formato del archivo de notas resaltadas exportado desde `Jingdu Tianxia apk` es `.mrexpt`. Coloque este archivo en cualquier directorio como `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc., y la plataforma puede completar automáticamente la operación de importación.

## 14. Importar constructor de vocabulario Kindle

Vocabulary Builder es una función en Kindle que registra palabras o frases buscadas mientras se lee un libro. Este método se puede utilizar para leer libros originales en inglés y registrar palabras, que se pueden usar para aprender y revisar estas palabras más tarde. La plataforma admite la importación de estos vocabularios.

Basándose en la importación de estos vocabularios, la plataforma proporciona una buena interfaz para mostrar esta información, y usted puede crear manualmente el vocabulario y los ejemplos, así como agregar traducciones a los ejemplos.

<img width="1322" alt="Xnip2023-03-31_23-23-41" src="https://user-images.githubusercontent.com/16133390/229163528-952ee43f-bf31-43a7-b39b-98d637e584da.png">
<img width="1320" alt="Xnip2023-03-31_23-23-57" src="https://user-images.githubusercontent.com/16133390/229163550 -8c321a41 -7df4 -41af -9bd0-fd765e113a1f.png">

# Requisitos del sistema

`python 3.10.4`

`nodejs v19.6.0`

`Calibre`

Otras versiones no han sido probadas

# Iniciar el servicio

## Instalar dependencias

1. Ejecutar en el directorio `backend`

```
pip3 install -r requirements.txt
```

2. Si necesita utilizar la función `chatgpt`, configure la clave `chatgpt` en `backend/config.ini`. La dirección para generar la clave en el sitio web oficial de OpenAi es `https://platform.openai.com/account/api-keys`.

3. Ejecutar en el directorio `frontend`

```
yarn install
```

## Iniciar el servicio

```
./start.sh
```

Luego visite http://localhost:8000 en su navegador.

## Detener el servicio

```
./stop.sh
``` 

## Nota

La plataforma está diseñada para individuos y no tiene características como inicio de sesión y registro.

# Demostración de la plataforma

A continuación se muestran capturas de pantalla de mi configuración local después de cargar libros y configurar colecciones.

<img width="1418" alt="1" src="https://user-images.githubusercontent.com/16133390/216806475-97ee4960-40cc-4649-b414-0687724bb6ad.png">
<br />
<img width="1398" alt="Xnip2023-02-05_15-13-49" src="https://user-images.githubusercontent.com/16133390/216806612-dc1baf4f-7ed5-4b3d-ab44-73c7f07c73a7.png">
<br />
<img width="1418" alt="2" src="https://user-images.githubusercontent.com/16133390/216806480-def76f45-f8ba-41fc-9512-a448e9fbce32.png">
<br />
<img width="1418" alt="3" src="https://user-images.githubusercontent.com/16133390/216806485-caf74fe2-0cef-45f8-9a29-47780e72132d.png">
<br />
<img width="1799" alt="Xnip2023-02-14_12-36-20" src="https://user-images.githubusercontent.com/16133390/218640667-ba74048a-3b78-41c6-a772-dc1e56485b56.png">

<br />
<img width="1801" alt="Xnip2023-02-14_12-36-38" src="https://user-images.githubusercontent.com/16133390/218640680-263195c2-7ac3-4947-b7a5-b70375074e9c.png">

<br />

# Otros

La herramienta más famosa para `kindle` debería ser `calibre`, pero la funcionalidad de este software se centra más en "edición", y la visualización multidimensional de los libros electrónicos es relativamente simple. Por lo tanto, planeo escribir una herramienta específicamente para administrar libros electrónicos que satisfaga las necesidades prácticas.

Actualmente, estoy desarrollando esta herramienta en mi tiempo libre. Si también te gusta leer libros electrónicos y tienes sugerencias para características de gestión de libros electrónicos, no dudes en plantear un problema.

Si tiene algún problema o solicitud de función, comuníquese con el autor por correo electrónico: wupengcn301@gmail.com, WeChat: leowucn. Gracias.
