
# Lazy Kindler
<br>
<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">


# ✨ Funktionen

- 🌈 Importieren Sie Bücher und zeigen Sie die Buchliste effizient an.

- 💅 Erstellen Sie Sammlungen, wie z.B. eine Sammlung von Science-Fiction-Romanen oder Kampfkunstromanen.

- 🚀 Mehrdimensionale Anzeige, zeigt die Buchliste nach Titel, Autor, Bewertung, Sammlung, Tags usw. an.

- 🛡 Suchen Sie nach Büchern mit jedem Schlüsselwort wie Titel, Autor oder Verlag.

- 📦 Laden Sie Bücher herunter - entweder über das Kontextmenü mit der rechten Maustaste oder durch Herunterladen aller von der Plattform verwalteten Bücher.

- 🛡 Buchlesen: Die Plattform unterstützt eine Lese-Funktion für Bücher.

- 📦 Backup-Funktion: Die Plattform verwendet `sqlite3` für die Datenbank und speichert alle Bücher in einem bestimmten Verzeichnis ab. Dadurch wird das Backup erleichtert.

- 🎻 Importieren Sie automatisch markierte Notizen beim Anschließen des Computers an den `Kindle`.

- 📣 Importieren Sie markierte Notizen aus der `静读天下apk` (Jing Du Tian Xia) auf Android-Geräten

.-🎺 Markierte Notizen: Unterstützt "sekundäre Hervorhebung" und "Löschung sekundärer Hervorhebungen" für importierte Notizen

.-🥁 Fügen Sie Kommentare zu markierten Notizen hinzu

.-🎻 Erstellen Sie Sammlungen für markierte Notizen und verwalten sie kategorisch

.-🚀 Kindle Vocabulary Builder: Die Plattform unterstützt den Import von Büchern, Wörtern und Beispielen aus dem Kindle Vocabulary Builder.

# Unterstützte Plattformen

Derzeit nur für die `mac`-Plattform angepasst. Es können unbekannte Fehler auftreten, wenn es auf der `Windows`-Plattform ausgeführt wird.

# Unterstützte eBook-Formate

Mobi und azw3. Andere Arten von eBooks werden beim Import automatisch ignoriert.

# Gelöstes Problem

Nach dem Herunterladen **tausender** eBooks aus dem Internet: Wie verwaltet man sie effizient?

<br />

Die Qualität verschiedener eBooks variiert stark - einige sind von gewöhnlichen Autoren geschrieben, andere von weltberühmten Schriftstellern. Es gibt auch viele verschiedene Genres wie Science-Fiction, Romantik, Fantasy und mehr.

<br />

Wenn Sie jedes Mal nach einem Buch in einem Verzeichnis mit Tausenden von Büchern suchen müssen, ist das sehr mühsam. Daher ist es notwendig, diese eBooks auf angemessene Weise zu verwalten - damit wir basierend auf spezifischen Präferenzen nach Büchern innerhalb eines kleineren Bereichs suchen können -, schnell das gewünschte Buch finden und nicht zu viel Zeit mit der Suche verschwenden.

<br />

`lazykindler` wurde genau dafür entwickelt.

# Funktionsübersicht

## 1. Buchimport

Klicken Sie auf die Schaltfläche "Datei hochladen", um alle unterstützten eBook-Dateien in Verzeichnissen wie `~/Download`, `~/下载`, `~/Desktop`, `~/桌面` usw. rekursiv zu scannen. Doppelte Dateien werden nicht erneut hochgeladen.

<br />

Derzeit werden nur `mobi`- und `azw3`-Formate für den Import unterstützt, und die Plattform bietet keine Funktion zur Konvertierung von eBook-Formaten. Es ist einfach, eBooks in bestimmten Formaten zu finden - ich finde sie normalerweise auf dieser Website: http://www.fast8.com. Der Vorteil dieser Seite besteht darin, dass eine große Auswahl an Büchern angeboten wird und beim Herunterladen mehrere Formatoptionen verfügbar sind. Laden Sie einfach die Bücher im gewünschten Format herunter.

## 2. Metadaten zu Büchern hinzufügen

Sie können die Bewertung des Buches, Tags, Sammlungen, AutorInnen, Verlage und Cover ändern. Beachten Sie jedoch bitte: Diese Operationen ändern das Buch selbst nicht wirklich; es werden lediglich Einträge in der Datenbank hinzugefügt.

## 3. Buchinformationen Parsen

Nach dem Importieren von eBooks extrahiert die Plattform automatisch Daten aus den eBook-Dateien zur Anzeige von Informationen und Buchverwaltung.

## 4. Sammlungen

Sie können Sammlungen von Büchern erstellen, wie z.B. `Science Fiction Collection`, `Fantasy Novel Collection`, `Romance Novel Collection` usw. Fügen Sie repräsentative Cover zu den Sammlungen hinzu, und Sie können diese bewerten und Tags hinzufügen. Jede Sammlung kann Bücher aus der Bibliothek auswählen und hinzufügen, und Sie können auch Bewertungen abgeben, Tags hinzufügen und Cover zu den Sammlungen hinzufügen. Sobald Sie mehrere Sammlungen haben, können Sie in Zukunft direkt nach Büchern aus diesen Sammlungen suchen.

## 5. Anzeige

Um das Anzeigen von Büchern aus verschiedenen Dimensionen zu unterstützen, können Sie Bücher bewerten und Tags hinzufügen sowie Autoren oder Verlage ändern. Bücher können aus verschiedenen Dimensionen wie `Bewertung`, `Tags`, `Autor`und`Verlag` angezeigt werden . Außerdem können Sie das Buchcover ändern.

## 6. Herunterladen

Bücher auf der Plattform können durch Klicken auf die Schaltfläche "Download" im Abschnitt "Operation" der Buchkarte heruntergeladen werden.Die heruntergeladenen Bücher werden im Benutzerverzeichnis unter "Download" oder "下载" gespeichert.Klicken auf "Alle Bücher herunterladen" auf der Homepage lädt alle Bücher in den Ordner "Dokumente" oder "文稿",der sich im Hauptverzeichnis "lazykindler" des Benutzerverzeichnisses befindet. Mehrfaches Klicken auf "Alle Bücher herunterladen" lädt keine bereits vorhandenen Bücher erneut herunter.

## 7. Lesen

Die Plattform bietet grundlegende Funktionen zum Lesen von Büchern an.Derzeit habe ich keine Bibliothek gefunden, die das Lesen von `mobi`- und `azw3`-Formaten mit `reactjs` implementiert hat. Daher konvertiert die Plattform beim ersten Klick auf die Schaltfläche "Buch lesen" diese beiden Formate in das Format `epub`. Das für die Konvertierung verwendete Tool ist `/Applications/calibre.app/Contents/MacOS/ebook-convert`, daher muss der Computer über eine installierte Version von Calibre verfügen, um die Buchlesefunktion ordnungsgemäß zu verwenden. Die Konvertierung ist nur beim ersten Klick auf "Buch lesen" erforderlich.Die Seite kann für kurze Zeit nicht reagieren, was normal ist.Die Wartezeit hängt von der Größe des E-Books ab, aber es geht normalerweise schnell.Konvertierte Bücher werden im Verzeichnis "backend/data" der Hauptplattform gespeichert.

<br />

## 8. Verarbeitungsworkflow

Die auf der Seite 'Bücher -> Bibliothek' angezeigten Bücher sind offiziell gespeicherte Bücher,während neu importierte Bücher auf der Seite 'Bücher -> Temporär' angezeigt werden.(Abgesehen vom Unterschied in den Seitenpositionen gibt es im Backend nicht viel Unterschied zwischen offiziellen und temporären Büchern).

<br />

Nachdem ein temporäres Buch einer beliebigen Sammlung hinzugefügt wurde, wird es von 'Bücher -> Temporär' nach 'Bücher -> Bibliothek' verschoben. Der Zweck davon ist es, **offiziell gespeicherte Bücher und temporär importierte Bücher zu unterscheiden. Offiziell gespeicherte Bücher wurden gefiltert, unerwünschte Bücher entfernt und kategorisiert, während temporär importierte Bücher tendenziell vielfältig sind.**

## 9. Backup

Die verwendete Datenbank ist `sqlite3` und befindet sich unter `backend/lazykindler.db`.

<br />

Beim ersten Start der Plattform wird die Datenbankdatei automatisch erstellt und initialisiert. Diese Datei enthält alle Dateninformationen in der Plattform außer den Büchern. Importierte Bücher werden in das Verzeichnis `backend/data` kopiert. Beachten Sie, dass für einen einfacheren internen Betrieb der Plattform die Buchnamen im Verzeichnis `backend/data` mit dem md5-Wert des Buches ergänzt werden.

<br />

Um alle Bücher und Daten auf der Plattform zu sichern, speichern Sie einfach `backend/lazykindler.db` und `backend/data`. Um den Dienst beim nächsten Mal an einem anderen Ort zu starten, kopieren Sie `backend/lazykindler.db` und `backend/data` an die entsprechenden Positionen.

## 10. Kindle-Highlights importieren

Diese Funktion wird derzeit nur auf Mac-Plattform unterstützt.

<br />

Die Plattform erkennt automatisch, ob das Gerät "Kindle" angeschlossen ist. Wenn das "Kindle"-Gerät mit dem Computer verbunden ist, importiert die Plattform die Datei "My Clippings.txt" aus dem "Kindle" zur einheitlichen Verwaltung und multidimensionalen Anzeige. Wenn sich die My Clippings.txt-Datei des Kindles ändert, importiert die Plattform automatisch den neu hinzugefügten Inhalt in My Clippings.txt, ohne alte Daten wiederholt zu importieren. Benutzer können den neu hinzugefügten Inhalt sehen, indem sie nach dem Anschließen des Kindles an den Computer die Seite aktualisieren.

<br />

Es sollte beachtet werden, dass das "Kindle" die vom Benutzer hinzugefügten Highlight-Notizen in einen Textblock ohne Zeilenumbrüche verarbeitet, auch wenn es sich um den Inhalt mehrerer Absätze handelt. `lazykindler` erkennt und verarbeitet Zeilenumbrüche beim Importieren der My Clippings.txt-Datei des Kindles intelligent, wie unten gezeigt.

<img src="https://user-images.githubusercontent.com/16133390/210229975-4e7145e7-5d91-4aff-85ff-f5550fd7fe2c.png" width="66%">

## 11. Sekundäres Hervorheben von markierten Notizen durchführen

Markierte Notizen sind Teil des Textes oder verwandter Absätze, die wir beim Lesen eines Buches hervorheben und aufzeichnen, oft weil ein Satz oder ein Wort darin eine bestimmte Wirkung auf uns hat. Nach dem Importieren der markierten Notizen in die Plattform ist es erforderlich, während des anschließenden Sortierungsprozesses die Sätze oder Wörter zu markieren, die damals mit Ihnen resoniert haben, um das kleine Stück Text leichter zu markieren und anzuzeigen.

<br />

Mit `lazykindler` können Sie ganz einfach sekundäres Hervorheben durchführen. Wählen Sie einfach den relevanten Text aus und klicken Sie auf "OK" im automatisch eingeblendeten Dialogfeld.

<img src="https://user-images.githubusercontent.com/16133390/210230077-c9a4532b-aafc-4ba2-a163-cd151c98d831.png" width="66%">

## 12. Kommentare zu markierten Notizen hinzufügen

Sie können einige Gedanken über den Text aufzeichnen, der mit Ihnen resoniert hat.

<img width="1379" alt="Xnip2023-02-05_15-19-18" src="https://user-images.githubusercontent.com/16133390/216806787-4b76a541-608d-4e8e-9d8e-2651bf7842ef.png">

## 13. Importieren Sie Highlights aus der Jingdu Tianxia apk

`Jingdu Tianxia apk` ist ein beliebter Reader auf der Android-Plattform. Ich verwende diese Software derzeit, um Bücher auf dem Hisense E-Reader zu lesen, und die Software unterstützt auch das Hinzufügen von markierten Notizen. Daher habe ich die Unterstützung für den Import von markierten Notizen aus dieser Software hinzugefügt.

<br />

Das Format der exportierten markierten Notizdatei aus `Jingdu Tianxia apk` lautet `.mrexpt`. Legen Sie diese Datei in einem beliebigen Verzeichnis wie `~/Download`, `~/下载`, `~/Desktop`, `~/桌面` usw. ab, und die Plattform kann den Import automatisch abschließen.

## 14. Importieren Sie Kindle Vocabulary Builder

Vocabulary Builder ist eine Funktion in Kindle, mit der Wörter oder Phrasen aufgezeichnet werden können, nach denen beim Lesen eines Buches gesucht wurde. Diese Methode kann verwendet werden, um englische Originalbücher zu lesen und Wörter aufzuzeichnen, die später zum Lernen und Überprüfen dieser Wörter verwendet werden können. Die Plattform unterstützt den Import dieser Vokabeln.

Basierend auf dem Importieren dieser Vokabeln bietet die Plattform eine gute Benutzeroberfläche zur Anzeige dieser Informationen an, und Sie können manuell Vokabeln und Beispiele erstellen sowie Übersetzungen zu Beispielen hinzufügen.

<img width="1322" alt="Xnip2023-03-31_23-23-41" src="https://user-images.githubusercontent.com/16133390/229163528-952ee43f-bf31-43a7-b39b-98d637e584da.png">

<img width="1320" alt="Xnip2023-03-31_23-23-57" src="https://user-images.githubusercontent.com/16133390/229163550-8c321a41-7df4-41af-9bd0-fd765e113a1f.png">

# Systemanforderungen

`python 3.10.4`

`nodejs v19.6.0`

`Calibre`

Andere Versionen sind nicht getestet.

# Starten Sie den Service

## Installieren Sie Abhängigkeiten

1. Führen Sie im Verzeichnis `backend` aus:

```

pip3 install -r requirements.txt

```

2. Führen Sie im Verzeichnis "frontend" aus:

```

yarn install

```

## Starten Sie den Service

```

./start.sh

```

Besuchen Sie dann http://localhost:8000 in Ihrem Browser.

## Stoppen des Dienstes

```

./stop.sh

```

## Hinweis

Die Plattform ist für Einzelpersonen konzipiert und verfügt nicht über Funktionen wie Anmeldung und Registrierung.

# Plattform Showcase

Im Folgenden finden Sie Screenshots meiner lokalen Einrichtung nach dem Hochladen von Büchern und Konfigurieren von Sammlungen.

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

# Andere

Das bekannteste Tool für `Kindle` sollte `Calibre` sein, aber die Funktionalität dieser Software ist eher auf "Bearbeitung" ausgerichtet und die mehrdimensionale Anzeige von E-Books ist relativ einfach. Daher plane ich, ein Werkzeug speziell für das Verwalten von E-Books zu schreiben, das praktischen Bedürfnissen entspricht.

Derzeit entwickle ich dieses Tool in meiner Freizeit. Wenn Sie auch gerne E-Books lesen und Vorschläge für Funktionen zur Verwaltung von E-Books haben, können Sie gerne ein Problem melden.

Wenn Sie Probleme oder Feature-Anfragen haben, wenden Sie sich bitte an den Autor: Email: wupengcn301@gmail.com, WeChat: leowucn. Vielen Dank.
